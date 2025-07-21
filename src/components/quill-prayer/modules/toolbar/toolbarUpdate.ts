import type { RefObject } from "react";
import type Quill from "quill";

export const updateToolbarState = (
  quillRef: RefObject<Quill | null>,
  editorRef: RefObject<HTMLDivElement | null>
) => {
  const selection = quillRef.current?.getSelection();
  if (!selection) return;

  const toolbar =
    editorRef.current?.parentElement?.querySelector(".ql-toolbar");
  const prayerOpacitySelect = toolbar?.querySelector(
    ".ql-prayer-opacity-select"
  ) as HTMLElement;

  if (prayerOpacitySelect) {
    const pickerLabel = prayerOpacitySelect.querySelector(
      ".ql-picker-label"
    ) as HTMLElement;
    const format = quillRef.current?.getFormat(
      selection.index,
      selection.length
    );

    // Sprawdź czy jest aktywny format prayer-opacity
    const currentOpacity = format && format["prayer-opacity"];

    if (currentOpacity && currentOpacity !== "100") {
      // Mamy aktywny format prayer-opacity (nie 100%)
      prayerOpacitySelect.classList.add("ql-active");

      // Ustaw odpowiedni tekst w labelu na podstawie aktualnej wartości
      if (pickerLabel) {
        pickerLabel.innerHTML = `<p>${currentOpacity}%</p><svg fill="#D9D9D9" width="20px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M12,2 C17.3333333,7.05448133 20,11.0544813 20,14 C20,18.418278 16.418278,22 12,22 C7.581722,22 4,18.418278 4,14 C4,11.0544813 6.66666667,7.05448133 12,2 Z M12.5401341,5.34306485 L12,4.793 L11.7832437,5.01193635 C8.50224504,8.34406715 6.63844327,11.052329 6.13806422,13.0012894 L17.8619358,13.0012894 C17.378236,11.1172943 15.6204935,8.52377427 12.5401341,5.34306485 L12.5401341,5.34306485 Z"/> </svg>`;
      }
    } else {
      // Nie ma aktywnego formatu prayer-opacity lub jest 100%, wyświetl 100%
      prayerOpacitySelect.classList.remove("ql-active");

      if (pickerLabel) {
        pickerLabel.innerHTML =
          '<p>100%</p><svg fill="#D9D9D9" width="20px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M12,2 C17.3333333,7.05448133 20,11.0544813 20,14 C20,18.418278 16.418278,22 12,22 C7.581722,22 4,18.418278 4,14 C4,11.0544813 6.66666667,7.05448133 12,2 Z M12.5401341,5.34306485 L12,4.793 L11.7832437,5.01193635 C8.50224504,8.34406715 6.63844327,11.052329 6.13806422,13.0012894 L17.8619358,13.0012894 C17.378236,11.1172943 15.6204935,8.52377427 12.5401341,5.34306485 L12.5401341,5.34306485 Z"/> </svg>';
      }
    }
  }
};
