import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import classNames from "@/utils/classNames";

// Imports for Prayer Quill extensions
import "./quill-prayer/styles/prayer-editor.css";
import { PrayerBlocks } from "./quill-prayer/blocks";
import {
  PrayerHandlers,
  PrayerKeyboard,
  PrayerToolbar,
  PrayerValidator,
} from "./quill-prayer/modules";

// Register Prayer Quill blocks and handlers
Quill.register("formats/prayer-header", PrayerBlocks.Header, true);
Quill.register("formats/prayer-title", PrayerBlocks.Title, true);
Quill.register("formats/prayer-quote", PrayerBlocks.Quote, true);
Quill.register("formats/prayer-opacity", PrayerBlocks.Opacity, true);
Quill.register("formats/prayer-line-bold", PrayerBlocks.LineBold, true);
Quill.register("formats/prayer-line", PrayerBlocks.Line, true);

interface QuillEditorProps {
  value: string;
  onChange?: (value: string) => void;
}


export interface QuillEditorRef {
  focus: () => void;
}

function checkSticky(toolbar: HTMLDivElement) {
  const rect = toolbar.getBoundingClientRect();
  if (rect.top <= 0) {
    toolbar.classList.add('sticky');
  } else {
    toolbar.classList.remove('sticky');
  }
}

const QuillPrayerEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
  ({ value, onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (quillRef.current) {
          quillRef.current.focus();
        }
      },
    }));

    useEffect(() => {
      let stickyListener: (() => void) | undefined;
      if (editorRef.current && !quillRef.current) {
        // Initialize scroll handler
        const scrollHandler = PrayerHandlers.createScrollHandler();

        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Tekst modlitwy",
          modules: {
            toolbar: {
              container: [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ size: ["small", false, "large", "huge"] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                [{ align: [] }],
                ["link"],
                ["clean"],
                [
                  "prayer-title",
                  "prayer-quote",
                  "prayer-header",
                  { "prayer-opacity-select": ["100", "75", "50", "25"] },
                  { "prayer-line-select": ["normal", "bold"] },
                ],
              ],
              handlers: {
                "prayer-title": PrayerHandlers.createTitleHandler(quillRef),
                "prayer-header": PrayerHandlers.createHeaderHandler(quillRef),
                "prayer-quote": PrayerHandlers.createQuoteHandler(quillRef),
                "prayer-opacity-select": PrayerHandlers.createOpacityHandler(
                  quillRef,
                  editorRef
                ),
                "prayer-line-select":
                  PrayerHandlers.createLineHandler(quillRef),
              },
            },
            keyboard: {
              bindings: PrayerKeyboard.createKeyboardBindings(),
            },
          },
        });

        quillRef.current.root.innerHTML = value;
        quillRef.current.on("text-change", () => {
          const cleanHtml = quillRef.current!.root.innerHTML;
          onChange?.(cleanHtml);
          // Update toolbar state after text change
          PrayerToolbar.updateState(quillRef, editorRef);
        });

        // Add listener for selection change
        quillRef.current.on("selection-change", () =>
          PrayerToolbar.updateState(quillRef, editorRef)
        );

        // Add listener for editor change events
        quillRef.current.on("editor-change", (eventType: any) => {
          if (eventType === "selection-change" || eventType === "text-change") {
            PrayerToolbar.updateState(quillRef, editorRef);
          }
        });

        // Initialize PrayerToolbar display
        setTimeout(() => {
          PrayerToolbar.initialize(editorRef);
          PrayerToolbar.updateState(quillRef, editorRef);

          const toolbarElement = document.querySelector('.ql-toolbar') as HTMLDivElement | null;
          if (toolbarElement) {
            stickyListener = () => checkSticky(toolbarElement);
            window.addEventListener('scroll', stickyListener);
            stickyListener();
          }
        }, 100);

        // Add scroll listeners
        if (editorRef.current) {
          scrollHandler.addScrollListener(editorRef.current);
        }

        // Initialize validator
        const validator = PrayerValidator.create(quillRef, editorRef);
        validator.start();
      }

      // Cleanup function
      return () => {
        // Clean up validator
        const validator = PrayerValidator.create(quillRef, editorRef);
        validator.stop();

        // Clean up scroll listeners
        if (editorRef.current) {
          const scrollHandler = PrayerHandlers.createScrollHandler();
          scrollHandler.removeScrollListener(editorRef.current);
        }

        // Clean up sticky scroll listener
        const toolbarElement = document.querySelector('.ql-toolbar') as HTMLDivElement | null;
        if (toolbarElement && stickyListener) {
          window.removeEventListener('scroll', stickyListener);
          stickyListener = undefined;
        }

        // Clean up any remaining delete buttons when component unmounts
        const existingButtons = document.querySelectorAll(
          '.prayer-line-delete-btn-overlay'
        );
        existingButtons.forEach((btn) => btn.remove());
      };
    }, [value, onChange]);

    return (
      <div
        className={classNames(
          "[&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:!border [&_.ql-toolbar]:!border-gray-300 [&_.ql-toolbar]:!bg-gray-50 [&_.ql-toolbar]:!p-2",
          "[&_.ql-container]:rounded-b-lg [&_.ql-container]:!border [&_.ql-container]:!border-t-0 [&_.ql-container]:!border-gray-300",
          "[&_.ql-toolbar_button]:flex [&_.ql-toolbar_button]:!items-center [&_.ql-toolbar_button]:!justify-center [&_.ql-toolbar_button]:!rounded [&_.ql-toolbar_button:hover]:!bg-gray-200 [&_.ql-toolbar_button.ql-active]:!bg-gray-300 [&_.ql-toolbar_button]:!transition-all [&_.ql-toolbar_button]:!duration-400 [&_.ql-toolbar_button]:!ease-in-out",
          "[&_.ql-toolbar_.ql-formats]:mr-3",
          "[&_.ql-editor]:text-black"
        )}
      >
        <div ref={editorRef} className="min-h-40" />
      </div>
    );
  }
);

QuillPrayerEditor.displayName = "QuillPrayerEditor";

export default React.memo(QuillPrayerEditor);
