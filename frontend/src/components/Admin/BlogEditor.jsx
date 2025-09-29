import React, { useState, useCallback, useRef, useEffect } from "react";

// --- Lucide React Imports ---
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  LinkIcon,
  ImageIcon,
  Palette,
  Type,
  Save,
  Upload,
  X,
} from "lucide-react";
import { postsAPI } from "../../Api/Api";
// --- Simplified UI Components ---

// Button component
const Button = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

// Toggle/Button styled component for Toolbar
const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
  className = "",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      h-8 w-8 p-1.5 flex items-center justify-center rounded-md text-gray-700
      hover:bg-gray-200 transition-colors
      ${
        isActive
          ? "bg-gray-300 hover:bg-gray-300 text-gray-900"
          : "bg-transparent"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `}
  >
    {children}
  </button>
);

// Popover component (Simplified)
const Popover = ({ trigger, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Trigger = trigger({
    onClick: () => setIsOpen((prev) => !prev),
    ref: triggerRef,
    isOpen,
  });

  return (
    <div className="relative inline-block">
      {Trigger}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 top-full mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-xl min-w-48"
        >
          {content({ close: () => setIsOpen(false) })}
        </div>
      )}
    </div>
  );
};

// --- Core Post Editor Component ---

const PostEditor = ({
  initialContent = "<p>Start writing...</p>",
  placeholder = "Start writing your article here...",
  initialData,
  categories = [],
  onSave,
  onPublish,
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for all post data (Content + Metadata)
  const [postData, setPostData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    coverImageUrl: initialData?.cover_image || "",
    content: initialData?.content || initialContent,
  });

  // --- Cloudinary Upload Function ---
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  // --- Utility Functions ---

  const updatePostData = useCallback((key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleEditorChange = () => {
    updatePostData("content", editorRef.current.innerHTML);
  };

  const handleSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      editorRef.current.currentSelection = selection.getRangeAt(0);
    }
  };

  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleEditorChange();
  };

  const isActive = (type, attrs = {}) => {
    if (type === "bold") return document.queryCommandState("bold");
    if (type === "italic") return document.queryCommandState("italic");
    if (type === "underline") return document.queryCommandState("underline");
    if (type === "bulletList")
      return document.queryCommandState("insertUnorderedList");
    if (type === "orderedList")
      return document.queryCommandState("insertOrderedList");
    const blockTag = document.queryCommandValue("formatBlock");
    if (type === "heading" && attrs.level)
      return blockTag === `H${attrs.level}`;
    if (type === "blockquote") return blockTag === "BLOCKQUOTE";
    if (type === "codeBlock") return blockTag === "PRE";
    return false;
  };

  // --- Slug Generation ---
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // --- BLOCK & MARK FUNCTIONS ---

  const toggleBlockType = (tag) => {
    const blockMap = {
      h1: "<H1>",
      h2: "<H2>",
      h3: "<H3>",
      p: "<P>",
      pre: "<PRE>",
      blockquote: "<BLOCKQUOTE>",
    };
    if (blockMap[tag]) {
      applyFormatting("formatBlock", blockMap[tag]);
    } else if (tag === "ul") {
      applyFormatting("insertUnorderedList");
    } else if (tag === "ol") {
      applyFormatting("insertOrderedList");
    }
  };

  const setTextAlign = (alignment) => {
    const commandMap = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      full: "justifyFull",
    };
    applyFormatting(commandMap[alignment]);
  };

  const setFont = (fontName) => applyFormatting("fontName", fontName);
  const setColor = (color) => applyFormatting("foreColor", color);
  const setHighlight = (color = "yellow") =>
    applyFormatting("backColor", color);

  const setLink = useCallback(() => {
    if (linkUrl) {
      const selection = editorRef.current.currentSelection;
      if (selection) {
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(selection);
      }
      applyFormatting("createLink", linkUrl);
      setLinkUrl("");
      editorRef.current.currentSelection = null;
    }
  }, [linkUrl]);

  // --- IMAGE UPLOAD LOGIC (Real Cloudinary) ---

  // Handle image upload for the Cover Image metadata field
  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      setError("");
      const imageUrl = await uploadToCloudinary(file);
      updatePostData("coverImageUrl", imageUrl);
    } catch (error) {
      console.error("Cover image upload failed:", error);
      setError("Cover image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  // Handle image upload for embedding into the content
  const handleContentImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      setError("");
      const imageUrl = await uploadToCloudinary(file);

      // Restore the cursor position
      const selection = editorRef.current.currentSelection;
      if (selection) {
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(selection);
      }

      // Insert the image into the contentEditable area
      applyFormatting("insertImage", imageUrl);

      // Clear selection
      editorRef.current.currentSelection = null;
    } catch (error) {
      console.error("Content image upload failed:", error);
      setError("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  // --- Read Time Calculation ---
  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // --- SAVE/API FUNCTION ---
  const handleSave = async () => {
    if (!postData.title || !postData.content) {
      setError("Title and content are required");
      return;
    }

    if (!postData.slug) {
      setError("Slug is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const finalPostData = {
        title: postData.title,
        slug: postData.slug,
        content: editorRef.current.innerHTML,
        excerpt: postData.excerpt,
        category: postData.category,
        cover_image: postData.coverImageUrl,
        read_time: calculateReadTime(editorRef.current.textContent) + " min",
      };

      // console.log("Saving post data:", finalPostData);

      // Simulate API call - replace with your actual postsAPI calls
      if (initialData?.id) {
        const response = await postsAPI.update(initialData.id, finalPostData);
        if (onSave) onSave(response.data.data);
        setSuccess("Post updated successfully");
      } else {
        const response = await postsAPI.create(finalPostData);
        if (onSave) onSave(response.data.data);
        setSuccess("Post created successfully");
      }

      // For now, just log success
      setSuccess(
        initialData?.id
          ? "Post updated successfully"
          : "Post created successfully"
      );

      if (onSave) onSave(finalPostData);
      if (onPublish) onPublish(finalPostData);
    } catch (error) {
      console.error("Error saving post:", error);
      setError(error.response?.data?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  // --- Initial Mount Effect ---
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = postData.content;
    }
  }, [postData.content]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!postData.slug && postData.title) {
      const generatedSlug = generateSlug(postData.title);
      updatePostData("slug", generatedSlug);
    }
  }, [postData.title, postData.slug, updatePostData]);

  // --- Render Logic ---

  const availableFonts = [
    { name: "Inter (Default)", value: "Inter, sans-serif" },
    { name: "Serif (Georgia)", value: "Georgia, serif" },
    { name: "Monospace (Courier)", value: "Courier New, monospace" },
    { name: "Sans Serif (Arial)", value: "Arial, sans-serif" },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
            <span className="mr-2">✅</span>
            {success}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {initialData?.id ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-gray-600 mt-2">
              Craft engaging content for your audience
            </p>
          </div>

          {/* Save Button */}
          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !postData.title || !postData.slug}
          >
            <Save className="inline h-4 w-4 mr-2" />
            {loading
              ? initialData?.id
                ? "Updating..."
                : "Publishing..."
              : initialData?.id
              ? "Update Post"
              : "Publish Post"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cover Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cover Image
              </h3>
              <div className="flex flex-col items-center">
                {postData.coverImageUrl ? (
                  <div className="relative w-full mb-3">
                    <img
                      src={postData.coverImageUrl}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => updatePostData("coverImageUrl", "")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-gray-400">No image selected</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  id="cover-image-upload"
                />
                <label
                  htmlFor="cover-image-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={imageUploading}
                >
                  {imageUploading ? "Uploading..." : "Upload Image"}
                </label>
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Post Settings
              </h3>

              {/* Excerpt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={postData.excerpt}
                  onChange={(e) => updatePostData("excerpt", e.target.value)}
                  placeholder="Brief description of your post..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={postData.slug}
                  onChange={(e) => updatePostData("slug", e.target.value)}
                  placeholder="post-url-slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used in the URL for your post
                </p>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={postData.category}
                  onChange={(e) => updatePostData("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Read Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">⏱️</span>
                  {calculateReadTime(editorRef.current?.textContent || "")} min
                  read
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Title Input */}
              <div className="p-6 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Enter post title..."
                  value={postData.title}
                  onChange={(e) => {
                    updatePostData("title", e.target.value);
                  }}
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0"
                />
              </div>

              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Undo/Redo */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => applyFormatting("undo")}
                      title="Undo"
                    >
                      <Undo className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => applyFormatting("redo")}
                      title="Redo"
                    >
                      <Redo className="h-4 w-4" />
                    </ToolbarButton>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Font Family */}
                  <Popover
                    trigger={({ onClick, ref, isOpen }) => (
                      <ToolbarButton
                        onClick={onClick}
                        title="Font Family"
                        ref={ref}
                        className="w-10"
                        isActive={isOpen}
                      >
                        <Type className="h-4 w-4" />
                      </ToolbarButton>
                    )}
                    content={({ close }) => (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 mb-2">
                          Select Font
                        </p>
                        {availableFonts.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => {
                              setFont(font.value.split(",")[0].trim());
                              close();
                            }}
                            className="w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors"
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    )}
                  />

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Headings */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => toggleBlockType("h1")}
                      isActive={isActive("heading", { level: 1 })}
                      title="Heading 1"
                    >
                      <Heading1 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => toggleBlockType("h2")}
                      isActive={isActive("heading", { level: 2 })}
                      title="Heading 2"
                    >
                      <Heading2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => toggleBlockType("h3")}
                      isActive={isActive("heading", { level: 3 })}
                      title="Heading 3"
                    >
                      <Heading3 className="h-4 w-4" />
                    </ToolbarButton>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Text Formatting */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => applyFormatting("bold")}
                      isActive={isActive("bold")}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => applyFormatting("italic")}
                      isActive={isActive("italic")}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => applyFormatting("underline")}
                      isActive={isActive("underline")}
                      title="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => applyFormatting("strikeThrough")}
                      isActive={isActive("strike")}
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        applyFormatting("insertHTML", "<code>&nbsp;</code>")
                      }
                      isActive={isActive("code")}
                      title="Inline Code"
                    >
                      <Code className="h-4 w-4" />
                    </ToolbarButton>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Text Color */}
                  <Popover
                    trigger={({ onClick, ref }) => (
                      <ToolbarButton
                        onClick={onClick}
                        title="Text Color"
                        ref={ref}
                      >
                        <Palette className="h-4 w-4" />
                      </ToolbarButton>
                    )}
                    content={({ close }) => (
                      <div className="w-48">
                        <div className="grid grid-cols-6 gap-1">
                          {[
                            "#000000",
                            "#DC2626",
                            "#EA580C",
                            "#D97706",
                            "#65A30D",
                            "#059669",
                            "#0891B2",
                            "#2563EB",
                            "#7C3AED",
                            "#C026D3",
                            "#4B5563",
                            "#D1D5DB",
                          ].map((color) => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform shadow-sm"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setColor(color);
                                close();
                              }}
                            />
                          ))}
                        </div>
                        <button
                          className="w-full mt-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setColor("black");
                            close();
                          }}
                        >
                          Remove Color
                        </button>
                      </div>
                    )}
                  />

                  {/* Highlight */}
                  <ToolbarButton
                    onClick={() => setHighlight("yellow")}
                    title="Highlight (Yellow)"
                  >
                    <Highlighter className="h-4 w-4 text-yellow-500" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Alignment */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => setTextAlign("left")}
                      title="Align Left"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => setTextAlign("center")}
                      title="Align Center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => setTextAlign("right")}
                      title="Align Right"
                    >
                      <AlignRight className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => setTextAlign("full")}
                      title="Justify"
                    >
                      <AlignJustify className="h-4 w-4" />
                    </ToolbarButton>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Lists, Quote, Code Block */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => toggleBlockType("ul")}
                      isActive={isActive("bulletList")}
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => toggleBlockType("ol")}
                      isActive={isActive("orderedList")}
                      title="Numbered List"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => toggleBlockType("blockquote")}
                      isActive={isActive("blockquote")}
                      title="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => toggleBlockType("pre")}
                      isActive={isActive("codeBlock")}
                      title="Code Block"
                    >
                      <Code className="h-4 w-4" />
                    </ToolbarButton>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Link */}
                  <Popover
                    trigger={({ onClick, ref }) => (
                      <ToolbarButton
                        onClick={onClick}
                        title="Add Link"
                        ref={ref}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </ToolbarButton>
                    )}
                    content={({ close }) => (
                      <div className="space-y-2">
                        <input
                          type="url"
                          placeholder="Enter URL"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setLink();
                              close();
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setLink();
                              close();
                            }}
                            className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                          >
                            Add Link
                          </button>
                          <button
                            onClick={() => {
                              applyFormatting("unlink");
                              close();
                            }}
                            className="flex-1 border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 transition-colors"
                          >
                            Remove Link
                          </button>
                        </div>
                      </div>
                    )}
                  />

                  {/* Image Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleContentImageUpload}
                    className="hidden"
                  />
                  <ToolbarButton
                    onClick={() => fileInputRef.current.click()}
                    title="Upload Image"
                    disabled={imageUploading}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </ToolbarButton>
                </div>
              </div>

              {/* Editor Content */}
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleEditorChange}
                onKeyUp={handleSelect}
                onMouseUp={handleSelect}
                className="
                  min-h-[400px] p-6 text-lg max-w-full overflow-y-auto
                  focus:outline-none transition-shadow
                  editor-content-styling
                "
                placeholder={placeholder}
              ></div>
            </div>

            {/* Word Count */}
            <div className="mt-4 text-sm text-gray-600">
              {editorRef.current?.textContent?.split(/\s+/).filter(Boolean)
                .length || 0}{" "}
              words • {calculateReadTime(editorRef.current?.textContent || "")}{" "}
              min read
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editor-content-styling {
          font-family: Inter, sans-serif;
          line-height: 1.6;
        }
        .editor-content-styling:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
          height: 0;
        }
        .editor-content-styling h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .editor-content-styling h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.625rem;
        }
        .editor-content-styling h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .editor-content-styling p {
          margin-bottom: 1rem;
        }
        .editor-content-styling ul,
        .editor-content-styling ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .editor-content-styling ul {
          list-style-type: disc;
        }
        .editor-content-styling ol {
          list-style-type: decimal;
        }
        .editor-content-styling blockquote {
          border-left: 4px solid #9ca3af;
          padding-left: 1rem;
          color: #4b5563;
          font-style: italic;
          margin: 1rem 0;
        }
        .editor-content-styling img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: block;
        }
        .editor-content-styling a {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }

        .editor-content-styling code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: "Courier New", monospace;
          font-size: 0.9em;
          color: #dc2626;
        }

        .editor-content-styling pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: "Courier New", monospace;
          font-size: 0.9em;
          margin: 1rem 0;
          white-space: pre-wrap;
          word-break: break-all;
        }

        #cover-image-upload::file-selector-button {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PostEditor;
