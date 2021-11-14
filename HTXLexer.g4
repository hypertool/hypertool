lexer grammar  HTXLexer;

COMMENT
    : '<!--' .*? '-->'
    ;

CDATA
    : '<![CDATA[' .*? ']]>'
    ;

WHITE_SPACE
    :  (' '|'\t'|'\r'? '\n')+
    ;

TAG_OPEN
    : '<' -> pushMode(TAG)
    ;

TEXT
    : ~'<'+
    ;

// Tags

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

// Attributes

TAG_EQUALS
    : '=' -> pushMode(ATTRIBUTE_VALUE)
    ;

TAG_NAME
    : TAG_NAME_START_CHAR TAG_NAME_CHAR*
    ;

TAG_WHITESPACE
    : [ \t\r\n] -> channel(HIDDEN)
    ;

fragment HEX_DIGIT
    : [a-fA-F0-9]
    ;

fragment DIGIT
    : [0-9]
    ;

fragment TAG_NAME_CHAR
    : TAG_NAME_START_CHAR
    | '-'
    | '_'
    | '.'
    | DIGIT
    | '\u00B7'
    | '\u0300'..'\u036F'
    | '\u203F'..'\u2040'
    ;

fragment TAG_NAME_START_CHAR
    : [:a-zA-Z]
    | '\u2070'..'\u218F'
    | '\u2C00'..'\u2FEF'
    | '\u3001'..'\uD7FF'
    | '\uF900'..'\uFDCF'
    | '\uFDF0'..'\uFFFD'
    ;

// Attribute values

mode ATTRIBUTE_VALUE;

// An attribute value may have spaces between the '=' and the value.
ATTRIBUTE_VALUE_VALUE
    : ' '* ATTRIBUTE -> popMode
    ;

ATTRIBUTE
    : DOUBLE_QUOTE_STRING
    | SINGLE_QUOTE_STRING
    | ATTRIBUTE_CHARACTERS
    | HEX_CHARACTERS
    | DECIMAL_CHARACTERS
    ;

fragment ATTRIBUTE_CHARACTERS
    : ATTRIBUTE_CHARACTER+ ' '?
    ;

fragment ATTRIBUTE_CHARACTER
    : [0-9a-zA-Z_]
    ;

fragment HEX_CHARACTERS
    : '0x' [0-9a-fA-F]+
    ;

fragment DECIMAL_CHARACTERS
    : [0-9]+?
    ;

fragment DOUBLE_QUOTE_STRING
    : '"' ~[<"]* '"'
    ;
fragment SINGLE_QUOTE_STRING
    : '\'' ~[<']* '\''
    ;