import { MouseEvent } from "react";
import { IMouseEvent, INode, TModifierKey } from "../types";

const nativeKeyByKey: Record<string, string> = {
  ALT: "Alt",
  ALT_GRAPH: "AltGraph",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  FN: "Fn",
  FN_LOCK: "FnLock",
  META: "Meta",
  NUM_LOCK: "NumLock",
  SCROLL_LOCK: "ScrollLock",
  SHIFT: "Shift",
  SYMBOL: "Symbol",
  SYMBOL_LOCK: "SymbolLock",
  SUPER: "Super",
  HYPER: "Hyper",
};

export const transformNativeMouseEvent = (
  event: MouseEvent<any>,
  target: INode
): IMouseEvent<INode> => ({
  target,
  createdAt: event.timeStamp,
  type: event.type,

  altKey: event.altKey,
  ctrlKey: event.ctrlKey,
  metaKey: event.metaKey,
  shiftKey: event.shiftKey,

  button: event.button,
  buttons: event.buttons,

  clientX: event.clientX,
  clientY: event.clientY,
  movementX: event.movementX,
  movementY: event.movementY,
  pageX: event.pageX,
  pageY: event.pageY,
  screenX: event.screenX,
  screenY: event.screenY,

  preventDefault: event.preventDefault,
  stopPropogation: event.stopPropagation,

  getModifierState: (key: TModifierKey): boolean => {
    const nativeKey = nativeKeyByKey[key];
    if (!nativeKey) {
      throw new Error(`Unknown modifier "${key}".`);
    }
    return event.getModifierState(nativeKey);
  },
});
