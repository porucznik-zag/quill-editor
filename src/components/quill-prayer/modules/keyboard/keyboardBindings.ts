export const createKeyboardBindings = () => {
  // Helper function to check if element is prayer-line element
  const isPrayerLineElement = (element: Element | null): boolean => {
    return (
      element !== null &&
      (element.classList.contains("prayer-line-speaker") ||
        element.classList.contains("prayer-line-text"))
    );
  };

  // Common handler for arrow navigation
  const createArrowHandler = () => {
    return function (this: any, _range: any) {
      const focusedElement = document.activeElement;
      if (isPrayerLineElement(focusedElement)) {
        return true; // Allow arrow navigation in prayer-line elements
      }
      return true; // Allow arrow navigation elsewhere
    };
  };

  // Common handler for clipboard operations
  const createClipboardHandler = (
    operation: "copy" | "paste" | "selectAll"
  ) => {
    return function (this: any, _range: any) {
      const focusedElement = document.activeElement;
      if (isPrayerLineElement(focusedElement)) {
        if (operation === "selectAll") {
          return false; // Block Quill handling, let subdiv handle it
        }
        return true; // Allow copy/paste in prayer-line elements
      }
      return true; // Allow operation elsewhere
    };
  };

  // Custom backspace handler
  const createBackspaceHandler = () => {
    return function (this: any) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const domRange = selection.getRangeAt(0);
        const focusedElement = document.activeElement;

        if (isPrayerLineElement(focusedElement)) {
          // For prayer-line-speaker: on backspace at beginning, delete previous element
          if (
            focusedElement?.classList.contains("prayer-line-speaker") &&
            domRange.startOffset === 0 &&
            domRange.collapsed
          ) {
            const prayerLineContainer = focusedElement.closest(
              ".prayer-line, .prayer-line-bold"
            );
            if (prayerLineContainer) {
              const prevElement = prayerLineContainer.previousElementSibling;
              if (prevElement) {
                prevElement.remove();
                return false; // Block default backspace
              } else {
                return true; // Allow normal backspace behavior
              }
            }
            return false;
          }

          // Check if there's selected text
          if (!domRange.collapsed) {
            domRange.deleteContents();
            return false; // Block default backspace
          }

          // Handle single character deletion
          if (domRange.startOffset > 0) {
            const currentText = focusedElement?.textContent || "";
            const newText =
              currentText.slice(0, domRange.startOffset - 1) +
              currentText.slice(domRange.startOffset);
            const newCursorPos = domRange.startOffset - 1;

            if (focusedElement) {
              focusedElement.textContent = newText;

              // Set cursor position
              const range = document.createRange();
              const sel = window.getSelection();

              if (
                focusedElement.firstChild &&
                focusedElement.firstChild.nodeType === Node.TEXT_NODE
              ) {
                const textLength =
                  focusedElement.firstChild.textContent?.length || 0;
                const safePos = Math.min(newCursorPos, textLength);
                range.setStart(focusedElement.firstChild, safePos);
                range.setEnd(focusedElement.firstChild, safePos);
              } else if (newText.length === 0) {
                range.setStart(focusedElement, 0);
                range.setEnd(focusedElement, 0);
              } else {
                const textNode = document.createTextNode(newText);
                focusedElement.innerHTML = "";
                focusedElement.appendChild(textNode);
                range.setStart(textNode, newCursorPos);
                range.setEnd(textNode, newCursorPos);
              }

              sel?.removeAllRanges();
              sel?.addRange(range);
            }
          }

          return false; // Always block default backspace in prayer-line elements
        }
      }

      return true; // Allow normal backspace outside prayer-line
    };
  };

  return {
    "arrow-left": {
      key: "ArrowLeft",
      handler: createArrowHandler(),
    },
    "arrow-right": {
      key: "ArrowRight",
      handler: createArrowHandler(),
    },
    "arrow-up": {
      key: "ArrowUp",
      handler: createArrowHandler(),
    },
    "arrow-down": {
      key: "ArrowDown",
      handler: createArrowHandler(),
    },
    "ctrl-c": {
      key: "c",
      ctrlKey: true,
      handler: createClipboardHandler("copy"),
    },
    "ctrl-v": {
      key: "v",
      ctrlKey: true,
      handler: createClipboardHandler("paste"),
    },
    "ctrl-a": {
      key: "a",
      ctrlKey: true,
      handler: createClipboardHandler("selectAll"),
    },
    "custom-backspace": {
      key: "Backspace",
      handler: createBackspaceHandler(),
    },
  };
};
