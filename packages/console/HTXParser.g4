parser grammar HTXParser;

options {
    tokenVocab = HTXLexer;
}

compilationUnit
    : misc* element misc*
    ;

element
    : shortElement
    | longElement
    ;

shortElement
    : TAG_OPEN TAG_NAME attribute* TAG_SLASH_CLOSE
    ;

longElement
    : TAG_OPEN TAG_NAME attribute* TAG_CLOSE
      content
      TAG_OPEN TAG_SLASH TAG_NAME TAG_CLOSE
    ;

content
    : text? ((element | CDATA | COMMENT) text?)*
    ;

attribute
    : TAG_NAME (TAG_EQUALS ATTRIBUTE_VALUE)?
    ;

text
    : TEXT
    | WHITE_SPACE
    ;

misc
    : COMMENT
    | WHITE_SPACE
    ;