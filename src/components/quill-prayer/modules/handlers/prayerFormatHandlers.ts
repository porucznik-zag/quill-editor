import Quill from "quill";
import type { RefObject } from "react";

export const createPrayerTitleHandler = (quillRef: RefObject<Quill | null>) => {
  return function (this: any) {
    const range = quillRef.current?.getSelection();
    if (range && quillRef.current) {
      const currentFormat = quillRef.current.getFormat(range.index, 0);
      const isActive = currentFormat["prayer-title"] === true;
      quillRef.current.formatLine(range.index, 1, "prayer-title", !isActive);
    }
  };
};

export const createPrayerHeaderHandler = (
  quillRef: RefObject<Quill | null>
) => {
  return function (this: any) {
    const range = quillRef.current?.getSelection();
    if (range && quillRef.current) {
      const currentFormat = quillRef.current.getFormat(range.index, 0);
      const isActive = currentFormat["prayer-header"] === true;
      quillRef.current.formatLine(range.index, 1, "prayer-header", !isActive);
    }
  };
};

export const createPrayerQuoteHandler = (quillRef: RefObject<Quill | null>) => {
  return function (this: any) {
    const range = quillRef.current?.getSelection();
    if (range && quillRef.current) {
      const currentFormat = quillRef.current.getFormat(range.index, 0);
      const isActive = currentFormat["prayer-quote"] === true;
      quillRef.current.formatLine(range.index, 1, "prayer-quote", !isActive);
    }
  };
};
