import { useState, useRef } from "react";
import QuillPrayerEditor from "./components/QuillPrayerEditor";
import type { QuillEditorRef } from "./components/QuillPrayerEditor";
import "./App.css";

function App() {
  // It is possible to set initial editor content here
  const [content, setContent] = useState("");
  const editorRef = useRef<QuillEditorRef>(null);

  return (
    <div className="App">
      <h1>Edytor Quill:</h1>

      <QuillPrayerEditor ref={editorRef} value={content} onChange={setContent} />

      <div style={{ marginTop: "20px" }}>
        <h3>Podgląd HTML:</h3>
        <pre className="html-preview">{content}</pre>
      </div>
    </div>
  );
}

export default App;
