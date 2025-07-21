import Quill from "quill";
import type { RefObject } from "react";

export const createPrayerLineHandler = (quillRef: RefObject<Quill | null>) => {
  return function (this: any, value: string) {
    const range = quillRef.current?.getSelection();
    if (range && value && value !== "" && quillRef.current) {
      if (value === "normal") {
        // Insert normal prayer line
        quillRef.current.insertEmbed(
          range.index,
          "prayer-line",
          { type: "normal", speaker: "", text: "" },
          "user"
        );
      } else if (value === "bold") {
        // Insert bold prayer line
        quillRef.current.insertEmbed(
          range.index,
          "prayer-line-bold",
          { type: "bold", speaker: "", text: "" },
          "user"
        );
      }
      // Move cursor after the inserted block
      quillRef.current.setSelection(range.index + 1, 0);
    }
  };
};
