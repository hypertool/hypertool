import HTXParser from "../antlr-gen/HTXParser";

class Visitor {

  visitCompilationUnit(context: any) {
    return this.visitElement(context.element());
  }

  visitElement(context: any) {
    const shortElement = context.shortElement();
    const longElement = context.longElement();

    if (shortElement) {
      return this.visitShortElement(shortElement);
    }

    return this.visitLongElement(longElement);
  }

  extractAttributes(context: any) {
    const attributes: any[] = [];
    let i = 0;
    let currentAttributeContext = null;
    while ((currentAttributeContext = context.attribute(i)) !== null) {
      const name = currentAttributeContext.TAG_NAME().getText();
      let value = currentAttributeContext.ATTRIBUTE_VALUE().getText();

      if (value.startsWith("\"") && value.endsWith("\"")) {
        value = value.substr(1, value.length - 2);
      }
      console.log(value);

      attributes.push({
        name,
        value,
      });
      i++;
    }
    return attributes;
  }

  visitShortElement(context: any) {
    const tagName = context.TAG_NAME().getText();
    const attributes = this.extractAttributes(context);
    return {
      tagName,
      attributes,
      children: [],
    };
  }

  visitLongElement(context: any) {
    const openTagName = context.TAG_NAME(0).getText();
    const closeTagName = context.TAG_NAME(1).getText();
    const attributes = this.extractAttributes(context);
    const children = this.visitContent(context.content());

    if (openTagName !== closeTagName) {
      throw new Error(
        `Open tag does not match close tag! ${openTagName} != ${closeTagName}`
      );
    }

    return {
      tagName: openTagName,
      attributes,
      children,
    };
  }

  // TODO: Extract text from CDATA
  visitContent(context: any): any[] {
    const children = [];
    for (let i = 0; i < context.children.length; i++) {
      const child = context.children[i];

      if (child instanceof HTXParser.TextContext) {
        const text = child.getText();
        children.push({
          type: "text",
          payload: text,
        });
      } else if (child instanceof HTXParser.ElementContext) {
        const element = this.visitElement(child);
        children.push({
          type: "element",
          payload: element,
        });
      }
    }
    return children;
  }

  printTree(context: any) {
    if (!context) {
      return;
    }

    if (context.children) {
      return context.children.map((child: any) => {
        if (child.children && child.children.length !== 0) {
          return child.accept(this);
        } else {
          console.log(child.getText());
          return child.getText();
        }
      });
    }
  }
}

export default Visitor;
