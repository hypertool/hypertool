grammar htx;

// Parser

compilationUnit
:   element+
;

element
:   '<' IDENTIFIER attribute* '>' content '<' '/' IDENTIFIER '>'
|   '<' IDENTIFIER attribute* '/''>'
;

content
:   characterData | (element | expression)*
;

attribute
:   IDENTIFIER '=' attributeValue
;

characterData
:   ~('<'|'{')+
;

attributeValue
:   BOOLEAN_LITERAL
|   STRING_LITERAL
|   DECIMAL_LITERAL
|   NULL_LITERAL
|   expression
;

expression
:   '{' skippable* '}'
;

skippable
:   ~('{'|'}')+
|   '{' skippable* '}'
;

// Lexer

NULL_LITERAL
:   'null'
;

BOOLEAN_LITERAL
:   'true'
|   'false'
;

DECIMAL_LITERAL
:   DECIMAL_INTEGER_LITERAL '.' [0-9] [0-9_]* EXPONENT_PART?
|   '.' [0-9] [0-9_]* EXPONENT_PART?
|   DECIMAL_INTEGER_LITERAL EXPONENT_PART?
;

fragment DECIMAL_INTEGER_LITERAL
:   '0'
|   [1-9] [0-9_]*
;

fragment EXPONENT_PART
:   [eE] [+-]? [0-9_]+
;

BINARY_INTEGER_LITERAL
:   '0' [bB] [01] [_01]*
;

IDENTIFIER
:   IDENTIFIER_START IDENTIFIER_PART*
;

fragment IDENTIFIER_PART
:   [a-z0-9_$]
;

fragment IDENTIFIER_START
:   [a-z_$]
;

STRING_LITERAL
:   (
        '"' DOUBLE_STRING_CHARACTER* '"'
    |   '\'' SINGLE_STRING_CHARACTER* '\''
    )
;

fragment DOUBLE_STRING_CHARACTER
:   '"' ~[<"]* '"'
;

fragment SINGLE_STRING_CHARACTER
:   '\'' ~[<']* '\''
;

WHITE_SPACE
:   [\t\u000B\u000C\u0020\u00A0\r\n\u2028\u2029]+ -> channel(HIDDEN)
;

MULTILINE_COMMENT
:   '/*' .*? '*/' -> channel(HIDDEN)
;