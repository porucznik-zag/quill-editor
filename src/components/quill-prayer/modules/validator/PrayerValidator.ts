import type { RefObject } from "react";
import type Quill from "quill";

interface ValidationIssue {
  type: "spacing" | "consecutive";
  message: string;
  lineIndex: number;
}

class ValidationTooltip {
  private tooltipElement: HTMLDivElement | null = null;
  private iconElement: HTMLDivElement | null = null;
  private editorContainer: HTMLElement | null = null;

  constructor(editorContainer: HTMLElement) {
    this.editorContainer = editorContainer;
    this.createTooltipIcon();
  }

  private createTooltipIcon() {
    // Create icon container
    this.iconElement = document.createElement("div");
    this.iconElement.className = "prayer-validation-icon";
    this.iconElement.innerHTML = `
      <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	      width="18px" height="18px" viewBox="0 0 123.996 123.996" xml:space="preserve">
        <g>
          <path d="M9.821,118.048h104.4c7.3,0,12-7.7,8.7-14.2l-52.2-92.5c-3.601-7.199-13.9-7.199-17.5,0l-52.2,92.5
            C-2.179,110.348,2.521,118.048,9.821,118.048z M70.222,96.548c0,4.8-3.5,8.5-8.5,8.5s-8.5-3.7-8.5-8.5v-0.2c0-4.8,3.5-8.5,8.5-8.5
            s8.5,3.7,8.5,8.5V96.548z M57.121,34.048h9.801c2.699,0,4.3,2.3,4,5.2l-4.301,37.6c-0.3,2.7-2.1,4.4-4.6,4.4s-4.3-1.7-4.6-4.4
            l-4.301-37.6C52.821,36.348,54.422,34.048,57.121,34.048z"/>
        </g>
      </svg>
    `;

    // Create tooltip
    this.tooltipElement = document.createElement("div");
    this.tooltipElement.className = "prayer-validation-tooltip";

    // Add arrow
    const arrow = document.createElement("div");
    arrow.className = "prayer-validation-tooltip-arrow";
    this.tooltipElement.appendChild(arrow);

    // Add hover events
    this.iconElement.addEventListener("mouseenter", () => {
      if (this.tooltipElement) {
        this.tooltipElement.style.opacity = "1";
        this.tooltipElement.style.transform = "translateY(0)";
        this.tooltipElement.style.pointerEvents = "auto";
      }
    });

    this.iconElement.addEventListener("mouseleave", () => {
      if (this.tooltipElement) {
        this.tooltipElement.style.opacity = "0";
        this.tooltipElement.style.transform = "translateY(10px)";
        this.tooltipElement.style.pointerEvents = "none";
      }
    });

    // Append to icon
    this.iconElement.appendChild(this.tooltipElement);

    // Find editor container
    const editorContainer = this.editorContainer?.querySelector(
      ".ql-container"
    ) as HTMLElement;

    if (editorContainer) {
      editorContainer.style.position = "relative";
      editorContainer.appendChild(this.iconElement);
    } else {
      // Fallback - add to editor ref directly
      if (this.editorContainer) {
        this.editorContainer.style.position = "relative";
        this.editorContainer.appendChild(this.iconElement);
      }
    }
  }

  show(issues: ValidationIssue[]) {
    if (!this.iconElement || !this.tooltipElement) return;

    // Show icon
    this.iconElement.style.opacity = "1";
    this.iconElement.style.transform = "scale(1)";

    // Update tooltip content
    const messages = issues.map((issue) => issue.message);
    this.tooltipElement.innerHTML = `
      <div class="prayer-validation-tooltip-header">Zalecenia formatowania</div>
      ${messages
        .map(
          (msg) => `<div class="prayer-validation-tooltip-message">${msg}</div>`
        )
        .join("")}
      <div class="prayer-validation-tooltip-arrow-shown"></div>
      `;
    // <div class="prayer-validation-tooltip-footer">Stosowanie się do tych zaleceń pozwoli uniknąć błędów związanych z formatowaniem</div>
  }

  hide() {
    if (!this.iconElement) return;

    this.iconElement.style.opacity = "0";
    this.iconElement.style.transform = "scale(0.8)";
  }

  destroy() {
    if (this.iconElement && this.iconElement.parentNode) {
      this.iconElement.parentNode.removeChild(this.iconElement);
    }
    this.iconElement = null;
    this.tooltipElement = null;
  }
}

export const createPrayerValidator = (
  quillRef: RefObject<Quill | null>,
  editorRef: RefObject<HTMLDivElement | null>
) => {
  let tooltip: ValidationTooltip | null = null;
  let validationTimeout: NodeJS.Timeout | null = null;

  const validateContent = () => {
    if (!quillRef.current) return;

    const editor = quillRef.current;
    const issues: ValidationIssue[] = [];

    // Get all operations
    const ops = editor.getContents().ops;
    if (!ops) return;


    let currentIndex = 0;
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];

      // Check if this operation is a prayer line block
      if (
        op.insert &&
        typeof op.insert === "object" &&
        (op.insert["prayer-line"] || op.insert["prayer-line-bold"])
      ) {
        const lineType = op.insert["prayer-line-bold"]
          ? "pogrubiona"
          : "zwykła";

        // Check if there's content after this line
        const nextOp = ops[i + 1];

        if (nextOp) {
          if (
            nextOp.insert &&
            typeof nextOp.insert === "string" &&
            nextOp.insert.trim() !== "" &&
            !nextOp.insert.startsWith("\n")
          ) {
            issues.push({
              type: "spacing",
              // message: `Po linii ${lineType} powinien być odstęp (nowa linia).`,
              message: `Po linii z tagiem powinna być przynajmniej jedna pusta linia.`,
              lineIndex: currentIndex,
            });
          }
        } else {
          // Prayer line at the end - suggest adding content after
          issues.push({
            type: "spacing",
            message: `Po linii ${lineType} powinien być tekst lub odstęp`,
            lineIndex: currentIndex,
          });
        }
      }

      if (op.insert && typeof op.insert === "string") {
        currentIndex += op.insert.length;
      } else {
        currentIndex += 1;
      }
    }

    // Show or hide tooltip based on issues
    if (issues.length > 0) {
      if (!tooltip && editorRef.current) {
        tooltip = new ValidationTooltip(editorRef.current.parentElement!);
      }
      tooltip?.show(issues);
    } else {
      tooltip?.hide();
    }
  };

  const scheduleValidation = () => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    validationTimeout = setTimeout(validateContent, 300);
  };

  const startValidation = () => {
    if (!quillRef.current) return;

    // Listen to content changes
    quillRef.current.on("text-change", scheduleValidation);
    quillRef.current.on("selection-change", scheduleValidation);

    // Initial validation
    scheduleValidation();
  };

  const stopValidation = () => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    if (quillRef.current) {
      quillRef.current.off("text-change", scheduleValidation);
      quillRef.current.off("selection-change", scheduleValidation);
    }
    tooltip?.destroy();
    tooltip = null;
  };

  return {
    start: startValidation,
    stop: stopValidation,
    validate: validateContent,
  };
};

export const PrayerValidator = {
  create: createPrayerValidator,
};
