parser grammar HTXParser;

options {
    tokenVocab = HTXLexer;
}

compilationUnit
    : SEA_WS* htmlElements*
    ;

htmlElements
    : htmlMisc* htmlElement htmlMisc*
    ;

htmlElement
    : TAG_OPEN TAG_NAME htmlAttribute*
      (TAG_CLOSE (htmlContent TAG_OPEN TAG_SLASH TAG_NAME TAG_CLOSE)? | TAG_SLASH_CLOSE)
    ;

htmlContent
    : htmlChardata? ((htmlElement | CDATA | COMMENT) htmlChardata?)*
    ;

htmlAttribute
    : TAG_NAME (TAG_EQUALS ATTVALUE_VALUE)?
    ;

htmlChardata
    : HTML_TEXT
    | SEA_WS
    ;

htmlMisc
    : COMMENT
    | SEA_WS
    ;