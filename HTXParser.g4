parser grammar HTXParser;

options {
    tokenVocab = HTXLexer;
}

compilationUnit
    : WHITE_SPACE* elements*
    ;

elements
    : misc* element misc*
    ;

element
    : TAG_OPEN TAG_NAME attribute*
      (TAG_CLOSE (content TAG_OPEN TAG_SLASH TAG_NAME TAG_CLOSE)? | TAG_SLASH_CLOSE)
    ;

content
    : text? ((element | CDATA | COMMENT) text?)*
    ;

attribute
    : TAG_NAME (TAG_EQUALS ATTRIBUTE_VALUE_VALUE)?
    ;

text
    : TEXT
    | WHITE_SPACE
    ;

misc
    : COMMENT
    | WHITE_SPACE
    ;