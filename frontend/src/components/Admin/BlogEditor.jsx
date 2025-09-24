import React, { useState, useCallback, useEffect } from 'react';
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
  FiClock,
  FiAlertCircle,
  FiX
} from 'react-icons/fi';
import { postsAPI } from '../../Api/Api';

const BlogEditor = ({ onSave, onPublish, initialData, categories, currentUser }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'blog-link',
        },
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
    onUpdate: () => {
      // Auto-generate slug from title if empty
      if (!slug && title) {
        const generatedSlug = generateSlug(title);
        setSlug(generatedSlug);
      }
    },
  });

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  useEffect(() => {
    if (initialData?.id) {
      fetchPostData(initialData.id);
    }
  }, [initialData?.id]);

  const fetchPostData = async (postId) => {
    try {
      const response = await postsAPI.getOne(postId);
      const post = response.data.data;
      setTitle(post.title);
      setSlug(post.slug || '');
      setExcerpt(post.excerpt || '');
      setCategory(post.category || '');
      setCoverImage(post.cover_image || '');
      
      if (editor) {
        editor.commands.setContent(post.content);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post data');
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
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
      
      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        setImageUploading(true);
        const imageUrl = await uploadToCloudinary(file);
        
        if (editor && imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        setError('Image upload failed');
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

  const handleSave = async () => {
    if (!editor || !title) {
      setError('Title and content are required');
      return;
    }

    if (!slug) {
      setError('Slug is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const postData = {
        title,
        slug,
        content: editor.getHTML(),
        excerpt,
        category,
        cover_image: coverImage,
        read_time: calculateReadTime(editor.getText()) + ' min',
      };

      let response;
      
      if (initialData?.id) {
        // Update existing post
        response = await postsAPI.update(initialData.id, postData);
        if (onSave) onSave(response.data.data);
        setSuccess('Post updated successfully');
      } else {
        // Create new post
        response = await postsAPI.create(postData);
        if (onSave) onSave(response.data.data);
        setSuccess('Post created successfully');
      }

      if (onPublish) onPublish(response.data.data);
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const url = await uploadToCloudinary(file);
      setCoverImage(url);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Cover image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const removeCoverImage = () => {
    setCoverImage('');
  };

  if (!editor) {
    return <div className="flex justify-center items-center h-64">Loading editor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
            <FiAlertCircle className="mr-2" />
            {success}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {initialData?.id ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-gray-600 mt-2">
            Craft engaging content for your audience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cover Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h3>
              <div className="flex flex-col items-center">
                {coverImage ? (
                  <div className="relative w-full mb-3">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FiX size={16} />
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
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
              
              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  <FiClock className="mr-2" />
                  {calculateReadTime(editor.getText())} min read
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={loading || !title || !slug}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <FiGlobe className="mr-2" />
                  {loading ? 'Publishing...' : initialData?.id ? 'Update Post' : 'Publish Post'}
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
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Auto-generate slug when title changes
                    if (!slug) {
                      const newSlug = generateSlug(e.target.value);
                      setSlug(newSlug);
                    }
                  }}
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0"
                />
                <textarea
                  placeholder="Brief excerpt..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full mt-2 text-gray-600 placeholder-gray-400 border-none outline-none focus:ring-0 resize-none"
                  rows="2"
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
              <div className="p-6 min-h-96">
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

      <style jsx>{`
        .blog-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }
        
        .blog-link {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
        
        .min-h-300 {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;