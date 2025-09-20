import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiList, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight, 
  FiLink, 
  FiImage,
  FiSave,
  FiGlobe,
  FiType,
  FiClock
} from 'react-icons/fi';

const BlogEditor = ({ onSave, onPublish, initialData, categories }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialData?.content || '<p>Start writing your amazing content here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-300 p-4',
      },
    },
  });

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        setImageUploading(true);
        // Replace with your actual upload function
        const imageUrl = await uploadToCloudinary(file);
        
        if (editor && imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      } finally {
        setImageUploading(false);
      }
    };

    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleSave = async (publishStatus = 'draft') => {
    if (!editor || !title) return;

    setLoading(true);
    try {
      const postData = {
        title,
        content: editor.getHTML(),
        excerpt,
        category: selectedCategory,
        featuredImage,
        status: publishStatus,
        slug: generateSlug(title),
        readTime: calculateReadTime(editor.getText())
      };

      if (publishStatus === 'published') {
        await onPublish(postData);
      } else {
        await onSave(postData);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const uploadToCloudinary = async (file) => {
    // Implement your Cloudinary upload logic here
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {initialData ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-gray-600 mt-2">
            Craft engaging content for your audience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              <div className="flex flex-col items-center">
                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-gray-400">No image selected</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageUploading(true);
                      try {
                        const url = await uploadToCloudinary(file);
                        setFeaturedImage(url);
                      } catch (error) {
                        console.error('Upload failed:', error);
                      } finally {
                        setImageUploading(false);
                      }
                    }
                  }}
                  className="hidden"
                  id="featured-image-upload"
                />
                <label
                  htmlFor="featured-image-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
              
              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Read Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  {calculateReadTime(editor.getText())} min read
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading || !title}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <FiSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={loading || !title}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <FiGlobe className="mr-2" />
                  {loading ? 'Publishing...' : 'Publish Post'}
                </button>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0"
                />
                <input
                  type="text"
                  placeholder="Brief excerpt..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full mt-2 text-gray-600 placeholder-gray-400 border-none outline-none focus:ring-0"
                />
              </div>

              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiBold />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiItalic />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('underline') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiUnderline />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('bulletList') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiList />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiAlignLeft />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiAlignCenter />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiAlignRight />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('link') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FiLink />
                  </button>
                  <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-gray-200"
                    disabled={imageUploading}
                  >
                    <FiImage />
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="p-6">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Word Count */}
            <div className="mt-4 text-sm text-gray-600">
              {editor.getText().split(/\s+/).filter(Boolean).length} words • 
              {' '}{calculateReadTime(editor.getText())} min read
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;