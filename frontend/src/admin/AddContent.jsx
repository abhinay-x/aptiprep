import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';

const CONTENT_TAGS = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Data Interpretation',
  'General Knowledge',
  'Current Affairs',
  'Programming',
  'Soft Skills',
  'Interview Prep'
];

const CONTENT_TYPES = [
  { value: 'youtube', label: 'YouTube Video', icon: '📹' },
  { value: 'document', label: 'Document (PDF/DOC)', icon: '📄' },
  { value: 'image', label: 'Image/Presentation', icon: '🖼️' },
  { value: 'link', label: 'External Link', icon: '🔗' }
];

export default function AddContent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'youtube',
    contentUrl: '',
    tags: [],
    notes: '',
    pdfFile: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setFormData(prev => ({ ...prev, pdfFile: file }));
      setError(null);
    } else if (file) {
      setError('Please select a PDF, image, or video file only');
      e.target.value = '';
    }
  };

  const validateUrl = (url, contentType) => {
    if (!url) return true; // Optional field

    if (contentType === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return youtubeRegex.test(url);
    }

    if (contentType === 'link') {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }

    return true; // For document/image types, URL validation is basic
  };

  const uploadFile = async (file) => {
    const fileName = `lms-content/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.tags.length === 0) {
        throw new Error('Please select at least one tag');
      }
      if (!validateUrl(formData.contentUrl, formData.contentType)) {
        throw new Error(`Please enter a valid ${formData.contentType === 'youtube' ? 'YouTube' : 'URL'}`);
      }
      if (!formData.contentUrl && !formData.pdfFile) {
        throw new Error('Please provide either a content URL or upload a file');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to add content');
      }

      // Upload file if provided
      let fileUrl = '';
      let fileType = '';
      if (formData.pdfFile) {
        fileUrl = await uploadFile(formData.pdfFile);
        fileType = formData.pdfFile.type;
      }

      // Save to Firestore
      const contentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        contentType: formData.contentType,
        contentUrl: formData.contentUrl.trim() || '',
        fileUrl: fileUrl,
        fileType: fileType,
        tags: formData.tags,
        notes: formData.notes.trim() || '',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.displayName || user.email || 'Admin',
        isActive: true
      };

      await addDoc(collection(db, 'lmsContent'), contentData);

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        contentType: 'youtube',
        contentUrl: '',
        tags: [],
        notes: '',
        pdfFile: null
      });

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err.message || 'Failed to add content');
      console.error('Error adding content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Add Learning Content
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">✅ Content added successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Time & Work Fundamentals"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the content..."
              required
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CONTENT_TYPES.map(type => (
                <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contentType"
                    value={type.value}
                    checked={formData.contentType === type.value}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {type.icon} {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Content URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.contentType === 'youtube' && 'YouTube Video URL'}
              {formData.contentType === 'document' && 'Document URL (Google Drive, etc.)'}
              {formData.contentType === 'image' && 'Image/Presentation URL'}
              {formData.contentType === 'link' && 'External Link URL'}
            </label>
            <input
              type="url"
              name="contentUrl"
              value={formData.contentUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                formData.contentType === 'youtube' ? 'https://youtube.com/watch?v=...' :
                formData.contentType === 'document' ? 'https://drive.google.com/file/...' :
                formData.contentType === 'image' ? 'https://drive.google.com/file/...' :
                'https://example.com'
              }
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload File (Optional - PDF, Images, Videos)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.webm,.ogg"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">PDF, images, or video files (max 50MB for videos)</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CONTENT_TAGS.map(tag => (
                <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes or instructions..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  videoUrl: '',
                  tags: [],
                  notes: '',
                  pdfFile: null
                });
                setError(null);
                setSuccess(false);
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Content...' : 'Add Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
