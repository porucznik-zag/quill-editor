import Quill from "quill";
import type { RefObject } from "react";

export const createPrayerOpacityHandler = (
  quillRef: RefObject<Quill | null>,
  _editorRef: RefObject<HTMLDivElement | null>
) => {
  return function (this: any, value: string) {
    const range = quillRef.current?.getSelection();
    if (range && value && value !== "" && quillRef.current) {
      if (value === "100") {
        // Remove prayer-opacity format completely for 100%
        quillRef.current.formatLine(range.index, 1, "prayer-opacity", false);
      } else {
        // Apply prayer-opacity format with the selected opacity value
        quillRef.current.formatLine(range.index, 1, "prayer-opacity", {
          opacity: value,
        });
      }

      // Force selection change to trigger toolbar update
      setTimeout(() => {
        const currentSelection = quillRef.current?.getSelection();
        if (currentSelection) {
          quillRef.current?.setSelection(currentSelection);
        }
      }, 0);
    }
  };
};
