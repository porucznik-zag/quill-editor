import { BlockEmbed } from "quill/blots/block";
import Quill from "quill";

export class LineBlock extends BlockEmbed {
  static create(value: any) {
    const node = super.create() as HTMLElement;
    const type = value?.type === "bold" ? "bold" : "normal";
    node.classList.add(type === "bold" ? "prayer-line-bold" : "prayer-line");
    node.contentEditable = "false"; // Make container non-editable

    // Speaker
    const speaker = document.createElement("sapp");
    speaker.className = "prayer-line-speaker";
    speaker.contentEditable = "true";
    speaker.innerText = value?.speaker || "";

    // Text
    const text = document.createElement("div");
    text.className = "prayer-line-text";
    text.contentEditable = "true";
    text.innerText = value?.text || "";

    // Add event listeners for clipboard operations
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        const selectedText = selection.toString();

        // Copy only plain text, no HTML formatting
        if (e.clipboardData) {
          e.clipboardData.setData("text/plain", selectedText);
          e.clipboardData.setData("text/html", selectedText); // Also set as plain text for HTML
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Get plain text from clipboard
      const clipboardData = e.clipboardData;
      if (clipboardData) {
        const plainText = clipboardData.getData("text/plain");

        if (plainText) {
          // Get current selection
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Delete any selected content first
            if (!range.collapsed) {
              range.deleteContents();
            }

            // Insert plain text without any formatting
            const textNode = document.createTextNode(plainText);
            range.insertNode(textNode);

            // Move cursor to the end of inserted text
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    };

    // Mouse enter/leave handlers for delete button visibility
    const handleMouseEnter = () => {
      // Remove any existing delete buttons first
      const existingButtons = document.querySelectorAll(
        ".prayer-line-delete-btn-overlay"
      );
      existingButtons.forEach((btn) => btn.remove());

      // Create delete button
      const deleteButton = document.createElement("div");
      deleteButton.className = "prayer-line-delete-btn-overlay";
      deleteButton.title = "Usuń linię z tagiem";
      deleteButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="4" x2="14" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="4" x2="4" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;

      // Position button to cover full height of prayer-line
      const rect = node.getBoundingClientRect();
      deleteButton.style.left = rect.right - 30 + "px"; // 30px wide strip
      deleteButton.style.top = rect.top + "px";
      deleteButton.style.height = rect.height + "px"; // Full height of prayer-line

      // Add to body first
      document.body.appendChild(deleteButton);

      // Trigger animation after a small delay to ensure DOM is ready
      setTimeout(() => {
        deleteButton.classList.add("visible");
      }, 10);

      // Add click handler
      deleteButton.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Find the blot and remove it
        const blot = Quill.find(node);
        if (
          blot &&
          typeof blot === "object" &&
          "remove" in blot &&
          typeof blot.remove === "function"
        ) {
          (blot as any).remove();
        } else {
          node.remove();
        }

        // Clean up button
        deleteButton.remove();
      });

      // Add mouse leave handler to button to handle leaving button area
      deleteButton.addEventListener("mouseleave", (e: MouseEvent) => {
        setTimeout(() => {
          // Check if mouse is still over prayer-line
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          const nodeRect = node.getBoundingClientRect();
          const isOverNode =
            mouseX >= nodeRect.left &&
            mouseX <= nodeRect.right &&
            mouseY >= nodeRect.top &&
            mouseY <= nodeRect.bottom;

          // Remove button if mouse is not over prayer-line
          if (!isOverNode) {
            deleteButton.classList.remove("visible");
            setTimeout(() => deleteButton.remove(), 300); // Wait for animation to complete
            (node as any)._deleteButton = null;
          }
        }, 50);
      });

      // Store reference to button on the node for cleanup
      (node as any)._deleteButton = deleteButton;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Use setTimeout to check if mouse really left the area
      setTimeout(() => {
        const deleteButton = (node as any)._deleteButton;
        if (!deleteButton) return;

        // Get current mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Check if mouse is over prayer-line
        const nodeRect = node.getBoundingClientRect();
        const isOverNode =
          mouseX >= nodeRect.left &&
          mouseX <= nodeRect.right &&
          mouseY >= nodeRect.top &&
          mouseY <= nodeRect.bottom;

        // Check if mouse is over delete button
        const buttonRect = deleteButton.getBoundingClientRect();
        const isOverButton =
          mouseX >= buttonRect.left &&
          mouseX <= buttonRect.right &&
          mouseY >= buttonRect.top &&
          mouseY <= buttonRect.bottom;

        // Only remove button if mouse is not over prayer-line or button
        if (!isOverNode && !isOverButton) {
          deleteButton.classList.remove("visible");
          setTimeout(() => {
            deleteButton.remove();
            (node as any)._deleteButton = null;
          }, 300); // Wait for animation to complete
        }
      }, 50); // Small delay to handle rapid mouse movements
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Obsługa Enter na początku speaker
      if (e.key === "Enter") {
        const currentElement = e.target as HTMLElement;
        if (currentElement.classList.contains("prayer-line-speaker")) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range.startOffset === 0 && range.collapsed) {
              // Znajdź kontener prayer-line lub prayer-line-bold
              const prayerLineContainer = currentElement.closest(
                ".prayer-line, .prayer-line-bold"
              );
              if (prayerLineContainer) {
                const quillEditor = prayerLineContainer.closest(".ql-editor");
                if (quillEditor) {
                  // Wstaw <p><br></p> przed blokiem prayer-line lub prayer-line-bold
                  const p = document.createElement("p");
                  const br = document.createElement("br");
                  p.appendChild(br);
                  quillEditor.insertBefore(p, prayerLineContainer);
                  // Ustaw kursor w nowym paragrafie
                  const newRange = document.createRange();
                  newRange.setStart(p, 0);
                  newRange.setEnd(p, 0);
                  const sel = window.getSelection();
                  sel?.removeAllRanges();
                  sel?.addRange(newRange);
                  p.focus?.();
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }
            }
          }
        } else if (currentElement.classList.contains("prayer-line-text")) {
          // Sprawdź czy kursor jest na końcu text subdiva
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const textLength = currentElement.textContent?.length || 0;
            if (range.startOffset === textLength && range.collapsed) {
              // Kursor jest na końcu text - dodaj nowy paragraf poza blokiem prayer-line
              const prayerLineContainer = currentElement.closest(
                ".prayer-line, .prayer-line-bold"
              );
              if (prayerLineContainer) {
                const quillEditor = prayerLineContainer.closest(".ql-editor");
                if (quillEditor) {
                  // Wstaw <p><br></p> po bloku prayer-line lub prayer-line-bold
                  const p = document.createElement("p");
                  const br = document.createElement("br");
                  p.appendChild(br);

                  // Wstaw po aktualnym bloku prayer-line
                  const nextSibling = prayerLineContainer.nextSibling;
                  if (nextSibling) {
                    quillEditor.insertBefore(p, nextSibling);
                  } else {
                    quillEditor.appendChild(p);
                  }

                  // Ustaw kursor w nowym paragrafie
                  const newRange = document.createRange();
                  newRange.setStart(p, 0);
                  newRange.setEnd(p, 0);
                  const sel = window.getSelection();
                  sel?.removeAllRanges();
                  sel?.addRange(newRange);
                  p.focus?.();
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }
            }
          }
        }
        // W innych przypadkach blokuj Enter jak dotychczas
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Handle Tab key for navigation between speaker and text fields
      if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();

        const currentElement = e.target as HTMLElement;
        const prayerLineContainer = currentElement.closest(
          ".prayer-line, .prayer-line-bold"
        );

        if (prayerLineContainer) {
          const text = prayerLineContainer.querySelector(
            ".prayer-line-text"
          ) as HTMLElement;

          if (currentElement.classList.contains("prayer-line-speaker")) {
            // Move from speaker to text
            text.focus();
            // Set cursor at the beginning of text field
            const range = document.createRange();
            const sel = window.getSelection();
            if (
              text.firstChild &&
              text.firstChild.nodeType === Node.TEXT_NODE
            ) {
              range.setStart(text.firstChild, 0);
              range.setEnd(text.firstChild, 0);
            } else {
              range.setStart(text, 0);
              range.setEnd(text, 0);
            }
            sel?.removeAllRanges();
            sel?.addRange(range);
          } else if (currentElement.classList.contains("prayer-line-text")) {
            // Move from text outside of prayer-line to main editor or next prayer-line/prayer-line-bold
            e.preventDefault();
            e.stopPropagation();

            // Find the next sibling element after the prayer-line/prayer-line-bold
            let nextElement = prayerLineContainer.nextElementSibling;

            // Check if the next element is another prayer-line or prayer-line-bold
            if (
              nextElement &&
              (nextElement.classList.contains("prayer-line") ||
                nextElement.classList.contains("prayer-line-bold"))
            ) {
              // Move to the speaker field of the next prayer-line/prayer-line-bold
              const nextSpeaker = nextElement.querySelector(
                ".prayer-line-speaker"
              ) as HTMLElement;
              if (nextSpeaker) {
                nextSpeaker.focus();
                // Set cursor at the beginning of the next speaker field
                const range = document.createRange();
                const sel = window.getSelection();
                if (
                  nextSpeaker.firstChild &&
                  nextSpeaker.firstChild.nodeType === Node.TEXT_NODE
                ) {
                  range.setStart(nextSpeaker.firstChild, 0);
                  range.setEnd(nextSpeaker.firstChild, 0);
                } else {
                  range.setStart(nextSpeaker, 0);
                  range.setEnd(nextSpeaker, 0);
                }
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
            } else {
              // No next prayer-line/prayer-line-bold, move to main editor
              const quillEditor = prayerLineContainer.closest(".ql-editor");
              if (quillEditor) {
                // Create a range to position cursor
                const range = document.createRange();
                const sel = window.getSelection();

                if (nextElement) {
                  // If there's a next element (not prayer-line/prayer-line-bold), position cursor just before it
                  range.setStartBefore(nextElement);
                  range.setEndBefore(nextElement);
                } else {
                  // If no next element, position cursor at the very end of the editor
                  const editorLastChild = quillEditor.lastChild;
                  if (editorLastChild) {
                    if (editorLastChild.nodeType === Node.TEXT_NODE) {
                      const textLength =
                        editorLastChild.textContent?.length || 0;
                      range.setStart(editorLastChild, textLength);
                      range.setEnd(editorLastChild, textLength);
                    } else {
                      range.setStartAfter(editorLastChild);
                      range.setEndAfter(editorLastChild);
                    }
                  } else {
                    // Empty editor
                    range.setStart(quillEditor, 0);
                    range.setEnd(quillEditor, 0);
                  }
                }

                sel?.removeAllRanges();
                sel?.addRange(range);

                // Focus the main Quill editor
                if (quillEditor instanceof HTMLElement) {
                  quillEditor.focus();
                }
              }
            }
            return false;
          }
        }
        return false;
      }

      // Allow arrow key navigation within prayer-line/prayer-line-bold fields
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        e.stopPropagation(); // Prevent Quill from intercepting navigation
        return true; // Allow default browser behavior
      }

      // Allow clipboard shortcuts (but not cut)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "c" || e.key === "v") {
          e.stopPropagation(); // Prevent Quill from intercepting
          return true;
        }
        // Handle Ctrl+A (select all) specifically
        if (e.key === "a") {
          e.preventDefault();
          e.stopPropagation();

          // Select all text in the current subdiv
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            range.selectNodeContents(e.target as HTMLElement);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          return false;
        }
        // Block Ctrl+X (cut)
        if (e.key === "x") {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // Add clipboard and keyboard event listeners
    speaker.addEventListener("copy", handleCopy);
    speaker.addEventListener("paste", handlePaste);
    speaker.addEventListener("keydown", handleKeyDown);

    text.addEventListener("copy", handleCopy);
    text.addEventListener("paste", handlePaste);
    text.addEventListener("keydown", handleKeyDown);

    // Add hover listeners to the main container
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    // Container
    node.appendChild(speaker);
    node.appendChild(text);

    return node;
  }

  static value(node: HTMLElement) {
    const isBold = node.classList.contains("prayer-line-bold");
    return {
      type: isBold ? "bold" : "normal",
      speaker: node.querySelector(".prayer-line-speaker")?.textContent || "",
      text: node.querySelector(".prayer-line-text")?.textContent || "",
    };
  }

  static formats(node: HTMLElement) {
    // Return the specific format name, not just a value
    if (node.classList.contains("prayer-line-bold")) {
      return true; // For prayer-line-bold format
    }
    return false;
  }

  static match(node: HTMLElement) {
    // Only match regular prayer-line, not bold ones
    return node.classList.contains("prayer-line") && !node.classList.contains("prayer-line-bold");
  }
}
LineBlock.blotName = "prayer-line";
LineBlock.tagName = "sapp";

export class LineBlockBold extends LineBlock {
  static create(value: any) {
    return super.create({ ...value, type: "bold" });
  }

  static formats(node: HTMLElement) {
    // Return true if this is a bold prayer line
    if (node.classList.contains("prayer-line-bold")) {
      return true;
    }
    return false;
  }

  static match(node: HTMLElement) {
    // Only match prayer-line-bold
    return node.classList.contains("prayer-line-bold");
  }
}
LineBlockBold.blotName = "prayer-line-bold";
LineBlockBold.tagName = "sapp";
