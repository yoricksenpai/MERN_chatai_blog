// src/pages/CreatePost.tsx
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import ReactQuill from 'react-quill';
import { Navigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import '../css/App.css';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false); // Ajout du state featured
  const [isAuthorOrAdmin, setIsAuthorOrAdmin] = useState(false)
  const [blob, setBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef(null);

useEffect(() => {
  const checkAuthorAdminStatus = async () => {
    try {
      const response = await fetch('https://mern-backend-neon.vercel.app/check-author-admin', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setIsAuthorOrAdmin(data.isAuthorOrAdmin);
    } catch (error) {
      console.error('Error checking author/admin status:', error);
      setIsAuthorOrAdmin(false);
    }
  };

  checkAuthorAdminStatus();
}, []);



// Le reste du code du composant...


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      const file = inputFileRef.current.files[0];
      if (!file) {
        alert('Please select a file');
        return;
      }

      // Upload file to Vercel Blob
      const fileResponse = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!fileResponse.ok) throw new Error('File upload failed');
      const newBlob = await fileResponse.json();
      setBlob(newBlob);

      // Create post with the uploaded file URL
      const postData = {
        title,
        summary,
        content,
        category: selectedCategory,
        featured,
        cover: newBlob.url,
      };

      const postResponse = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });

      if (!postResponse.ok) throw new Error('Post creation failed');

      alert('Post created successfully!');
      // Reset form or redirect
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('https://mern-backend-neon.vercel.app/category');
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);


  if (redirect) {
    return <Navigate to="/" />;
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];
    if (!isAuthorOrAdmin) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Accès Non Autorisé</h1>
        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Cette page est réservée aux auteurs et administrateurs. Veuillez vous connecter avec un compte approprié.
        </p>
      </div>
    </div>
  );
}else{

    return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-2xl font-bold text-lime-600 sm:text-3xl">
          Create a New Post
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 bg-white rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <input
            type="text"
            placeholder="Enter your Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
          />
          <input
            type="text"
            placeholder="Enter your Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            required
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
          />
          <input
            type="file"
            ref={inputFileRef}
            required
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
          />
          <ReactQuill
            value={content}
            modules={modules}
            formats={formats}
            onChange={(newValue) => setContent(newValue)}
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Category:
            </label>
            <select
              title="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-lime-600 focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Featured Post
            </label>
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="block w-full rounded-lg bg-lime-600 px-5 py-3 text-sm font-medium text-white"
          >
            {isUploading ? 'Uploading...' : 'Create your post'}
          </button>
                </form>
                {blob && (
          <div className="mt-4">
            <p>Cover image uploaded: <a href={blob.url} target="_blank" rel="noopener noreferrer">{blob.url}</a></p>
            <img src={blob.url} alt="Uploaded cover" className="mt-2 max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>);
}
}
;

export default CreatePost;
