import { InputStream, CommonTokenStream } from "antlr4";
import HTXLexer from './antlr-gen/HTXLexer';
import HTXParser from './antlr-gen/HTXParser';

const compile = () => {
  try {
    const input = `<grid>
    <grid_item xs=12>
        <Typography id="hello">
            Students
    </Typography>
  </grid_item>

    <grid_item xs=12 md=6>
      <table id=1 data=null />

      <!-- Never hide -->
      <hidden when=false>
      
      <!-- Never hide -->
        <grid_item xs=12 md=6>
            <grid>
                <grid_item xs=12>
                    <text_field
                        id="firstName"
                        label="First Name"
                        value=null />

                    <text_field
                        id="lastName"
                        label="Last Name"
                        value=null />

                    <text_field
                        id="age"
                        type="number"
                        label="Age"
                        value=null />

                    <button
                        text="Update"
                        onClick=null
                        disabled=false />
                  </grid_item>
              </grid>
          </grid_item>
      </hidden>
    </grid>`;

    const chars = new InputStream(input);
    const lexer = new HTXLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new HTXParser(tokens);
    parser.buildParseTrees = true;
    const tree = parser.compilationUnit();

    class Visitor {
      visitChildren(ctx: any) {
        if (!ctx) {
          return;
        }
    
        if (ctx.children) {
          return ctx.children.map((child: any) => {
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
    
    tree.accept(new Visitor() as any);
  }
  catch (error) {
    console.log(error);
  }
};

compile();

const App = () => {
  return (
    <div>
      Hello, world!
    </div>
  );
}

export default App;
