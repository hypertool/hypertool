import { InputStream, CommonTokenStream } from "antlr4";
import HTXLexer from './antlr-gen/HTXLexer';
import HTXParser from './antlr-gen/HTXParser';
import { Visitor } from "./htx";

const compile = () => {
  try {
    const input = `<grid>
    <grid_item xs=12>
        <text id="hello">
            Students
        </text>
    </grid_item>

    <grid_item xs=12 md=6>
        <table id=1 data=null />

        <!-- Never hide -->
        <hidden when=false>
            <!-- Never hide -->
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
        </hidden>
    </grid_item>
</grid>`;

    const chars = new InputStream(input);
    const lexer = new HTXLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new HTXParser(tokens);
    parser.buildParseTrees = true;
    const tree = parser.compilationUnit();

    
    const visitor = new Visitor();
    const result = visitor.visitCompilationUnit(tree);
    console.log(result);
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
