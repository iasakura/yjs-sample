import Quill from "quill";
import QuillCursors from "quill-cursors";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";

Quill.register("modules/cursors", QuillCursors);

const quill = new Quill(document.querySelector("#editor")!, {
  modules: {
    cursors: true,
    toolbar: [
      // adding some basic Quill content features
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
    ],
    history: {
      // Local undo shouldn't undo changes
      // from remote users
      userOnly: true,
    },
  },
  placeholder: "Start collaborating...",
  theme: "snow", // 'bubble' is also great
});

// A Yjs document holds the shared data
const ydoc = new Y.Doc();
// Define a shared text type on the document
const ytext = ydoc.getText("quill");

// connect to the public demo server (not in production!)
const provider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  "quill-demo-room",
  ydoc
);

// Create an editor-binding which
// "binds" the quill editor to a Y.Text type.
const binding = new QuillBinding(ytext, quill, provider.awareness);

window.addEventListener("blur", () => {
  quill.blur();
});
