// MyProFroalaEditor.jsx
import React, { useRef, useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

/**
 * Pro Froala WYSIWYG with Cloudinary unsigned upload
 *
 * REQUIRED env variables:
 * - REACT_APP_CLOUDINARY_CLOUD_NAME
 * - REACT_APP_CLOUDINARY_UPLOAD_PRESET (unsigned preset)
 *
 * Notes:
 * - For higher security / larger files use a signed server-side upload (see notes at bottom).
 * - This component intercepts image uploads and uploads each file to Cloudinary,
 *   then inserts the returned secure_url into the editor.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;


const MyProFroalaEditor = ({ initialHTML = "<h1>Hello, Froala!</h1><p>Start typing...</p>", onSave }) => {
  const [content, setContent] = useState(initialHTML);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef(null);

  // Upload a single File object to Cloudinary (unsigned)
  const uploadToCloudinary = async (file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary variables not set. Add REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET to your .env"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const resp = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error("Cloudinary upload failed: " + errText);
    }

    const data = await resp.json();
    // Cloudinary returns secure_url
    return data.secure_url || data.url;
  };

  // Froala config
  const config = {
    placeholderText: "Start typing your content...",
    charCounterCount: true,
    // toolbar layout — pro-level options
    toolbarButtons: [
      "undo",
      "redo",
      "fullscreen",
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "subscript",
      "superscript",
      "|",
      "fontFamily",
      "fontSize",
      "color",
      "paragraphFormat", // includes headings H1,H2...
      "paragraphStyle",
      "|",
      "align",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "|",
      "insertLink",
      "insertImage",
      "insertVideo",
      "insertTable",
      "|",
      "quote",
      "insertHR",
      "html",
      "help",
    ],
    imageInsertButtons: ["imageBack", "|", "imageUpload", "imageByURL"],
    // disable Froala's own direct upload so we handle via events
    imageUpload: false,
    events: {
      // modelChanged updates state
      "contentChanged": function () {
        const editor = this;
        // read HTML
        const html = editor.html.get();
        setContent(html);
      },

      // Intercept image uploads (from file selection or drag/drop)
      "image.beforeUpload": async function (files) {
        // files is a FileList
        if (!files || files.length === 0) return false;
        const editor = this;

        // Prevent Froala's default upload behavior
        // We'll handle the upload and insertion ourselves
        try {
          setUploading(true);
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // optional: simple client-side size check
            if (file.size > 10 * 1024 * 1024) {
              // 10MB limit
              editor.events.trigger("image.error", ["File too large (max 10MB)."]);
              continue;
            }
            const url = await uploadToCloudinary(file);
            // Insert image into editor. Use Froala API if available, else fallback to html insertion.
            try {
              if (editor.image && typeof editor.image.insert === "function") {
                // arguments: src, check_toload, alt, title
                editor.image.insert(url, true, null, null);
              } else {
                editor.html.insert(`<img src="${url}" alt="Image" />`);
              }
            } catch (err) {
              // fallback
              editor.html.insert(`<img src="${url}" alt="Image" />`);
            }
          }
        } catch (err) {
          console.error("Upload error", err);
          // trigger Froala's image error event so user gets feedback
          if (this.events && typeof this.events.trigger === "function") {
            this.events.trigger("image.error", [err.message || "Upload failed."]);
          }
        } finally {
          setUploading(false);
        }

        // Return false to stop the default image upload.
        return false;
      },

      // Insert by URL button: we still rely on Froala's imageByURL behavior, so no changes required.
      // You can also add a custom toolbar button to prompt for a URL and insert it.
    },
    quickInsertTags: [], // disable quick insert (optional)
    tableInsertHelper: true,
    tabSpaces: 4,
    // other useful options
    videoInsertButtons: ["videoBack", "|", "videoByURL"],
    linkInsertButtons: ["linkBack", "|", "linkByURL"],
    htmlAllowedTags: [".*"], // allow all tags (be careful — sanitize server-side if accepting user content)
  };

  // Manual insert of an arbitrary image URL (exposed to UI)
  const insertImageUrl = (url) => {
    const ed = editorRef.current && editorRef.current.editor;
    if (!ed) {
      return;
    }
    try {
      if (ed.image && typeof ed.image.insert === "function") {
        ed.image.insert(url, true, null, null);
      } else {
        ed.html.insert(`<img src="${url}" alt="Image" />`);
      }
    } catch {
      ed.html.insert(`<img src="${url}" alt="Image" />`);
    }
  };

  // Example Save handler — call parent onSave or log to console
  const handleSave = () => {
    // IMPORTANT: sanitize server-side before storing / rendering if content comes from users
    if (onSave && typeof onSave === "function") {
      onSave(content);
    } else {
      console.log("Editor content:", content);
      alert("Content logged to console (or pass onSave prop).");
    }
  };

  // Small UI to show image URL paste box
  const [imageUrlInput, setImageUrlInput] = useState("");

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h3 style={{ marginBottom: 8 }}>Pro Froala Editor (Cloudinary image uploads)</h3>

      <div style={{ marginBottom: 8 }}>
        <small style={{ color: "#666" }}>
          Upload images (drag & drop or use image button). Images will be uploaded to Cloudinary.
        </small>
      </div>

      <FroalaEditor
        ref={editorRef}
        tag="textarea"
        model={content}
        config={config}
        onModelChange={(model) => setContent(model)}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          type="text"
          placeholder="Paste image URL and click Insert"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          onClick={() => {
            if (imageUrlInput.trim()) {
              insertImageUrl(imageUrlInput.trim());
              setImageUrlInput("");
            }
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "#2b6cb0",
            color: "white",
          }}
        >
          Insert URL
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "#2f855a",
            color: "white",
          }}
        >
          Save
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Uploading:</strong> {uploading ? "In progress..." : "Idle"}
      </div>

      <div style={{ marginTop: 16 }}>
        <p style={{ marginBottom: 6 }}><strong>Current HTML Content (preview)</strong></p>
        <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
          {/* Danger: rendering HTML — only safe for preview in trusted contexts. */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export default MyProFroalaEditor;
