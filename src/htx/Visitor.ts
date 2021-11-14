class Visitor {
    result = {}

    visitCompilationUnit(context: any) {
        this.visitElement(context.element());
    }

    visitElement(context: any) {
        const shortElement = context.shortElement();
        const longElement = context.longElement();

        if (shortElement) {
            this.visitShortElement(shortElement);
        }
        else {
            this.visitLongElement(longElement);
        }
    }

    visitShortElement(context: any) {
        const tagName = context.TAG_NAME().getText();
        const attributes: any[] = [];
        let i = 0;
        let currentAttributeContext = null;
        while ((currentAttributeContext = context.attribute(i)) != null) {
            const name = currentAttributeContext.TAG_NAME().getText();
            const value = currentAttributeContext.ATTRIBUTE_VALUE().getText();
            attributes.push({
                name,
                value
            });
            i++;
        }
        console.log(tagName, attributes);
    }

    visitLongElement(context: any) {}

  visitChildren(context: any) {
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
