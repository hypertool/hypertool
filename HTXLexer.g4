lexer grammar  HTXLexer;

COMMENT
    : '<!--' .*? '-->'
    ;

CDATA
    : '<![CDATA[' .*? ']]>'
    ;

SEA_WS
    :  (' '|'\t'|'\r'? '\n')+
    ;

TAG_OPEN
    : '<' -> pushMode(TAG)
    ;

HTML_TEXT
    : ~'<'+
    ;

// tag declarations

mode TAG;

TAG_CLOSE
    : '>' -> popMode
    ;

TAG_SLASH_CLOSE
    : '/>' -> popMode
    ;

TAG_SLASH
    : '/'
    ;


// lexing mode for attribute values

TAG_EQUALS
    : '=' -> pushMode(ATTVALUE)
    ;

TAG_NAME
    : TAG_NameStartChar TAG_NameChar*
    ;

TAG_WHITESPACE
    : [ \t\r\n] -> channel(HIDDEN)
    ;

fragment
HEXDIGIT
    : [a-fA-F0-9]
    ;

fragment
DIGIT
    : [0-9]
    ;

fragment
TAG_NameChar
    : TAG_NameStartChar
    | '-'
    | '_'
    | '.'
    | DIGIT
    | '\u00B7'
    | '\u0300'..'\u036F'
    | '\u203F'..'\u2040'
    ;

fragment
TAG_NameStartChar
    : [:a-zA-Z]
    | '\u2070'..'\u218F'
    | '\u2C00'..'\u2FEF'
    | '\u3001'..'\uD7FF'
    | '\uF900'..'\uFDCF'
    | '\uFDF0'..'\uFFFD'
    ;

// attribute values

mode ATTVALUE;

// an attribute value may have spaces b/t the '=' and the value
ATTVALUE_VALUE
    : ' '* ATTRIBUTE -> popMode
    ;

ATTRIBUTE
    : DOUBLE_QUOTE_STRING
    | SINGLE_QUOTE_STRING
    | ATTCHARS
    | HEXCHARS
    | DECCHARS
    ;

fragment ATTCHARS
    : ATTCHAR+ ' '?
    ;

fragment ATTCHAR
    : [0-9a-zA-Z_]
    ;

fragment HEXCHARS
    : '0x' [0-9a-fA-F]+
    ;

fragment DECCHARS
    : [0-9]+?
    ;

fragment DOUBLE_QUOTE_STRING
    : '"' ~[<"]* '"'
    ;
fragment SINGLE_QUOTE_STRING
    : '\'' ~[<']* '\''
    ;