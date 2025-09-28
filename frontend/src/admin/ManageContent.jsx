import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export default function ManageContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'lmsContent'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const contentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContent(contentList);
    } catch (err) {
      setError('Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleContentStatus = async (contentId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'lmsContent', contentId), {
        isActive: !currentStatus
      });
      setContent(prev => prev.map(item =>
        item.id === contentId ? { ...item, isActive: !currentStatus } : item
      ));
    } catch (err) {
      console.error('Error updating content status:', err);
      alert('Failed to update content status');
    }
  };

  const deleteContent = async (contentId) => {
    const contentToDelete = content.find(item => item.id === contentId);

    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    setDeleting(contentId);

    try {
      // Delete PDF from Storage if it exists
      if (contentToDelete.pdfUrl) {
        try {
          // Extract file path from download URL
          const url = new URL(contentToDelete.pdfUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
          if (pathMatch) {
            const filePath = decodeURIComponent(pathMatch[1]);
            const storageRef = ref(storage, filePath);
            await deleteObject(storageRef);
          }
        } catch (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
          // Continue with document deletion even if storage deletion fails
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'lmsContent', contentId));

      // Update local state
      setContent(prev => prev.filter(item => item.id !== contentId));

      alert('Content deleted successfully');
    } catch (err) {
      console.error('Error deleting content:', err);
      alert('Failed to delete content');
    } finally {
      setDeleting(null);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && item.isActive) ||
      (filter === 'inactive' && !item.isActive) ||
      (filter !== 'active' && filter !== 'inactive' && item.tags?.includes(filter));

    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const getUniqueTagsFromContent = () => {
    const allTags = content.flatMap(item => item.tags || []);
    return [...new Set(allTags)].sort();
  };

  if (loading) {
    return (
      <AdminLayout currentPage="videos">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="videos">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Learning Content
            </h2>
            <button
              onClick={fetchContent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search content by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({content.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active ({content.filter(c => c.isActive).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Inactive ({content.filter(c => !c.isActive).length})
            </button>
            {getUniqueTagsFromContent().map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag} ({content.filter(c => c.tags?.includes(tag)).length})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="p-6">
          {filteredContent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'all' && searchTerm === ''
                  ? 'No content found'
                  : `No ${filter !== 'all' ? filter : ''} content found${searchTerm ? ' matching your search' : ''}`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredContent.map(item => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags?.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Created by: {item.createdByName || 'Unknown'}</p>
                        <p>Created: {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</p>
                        {item.videoUrl && (
                          <p>📹 Video: <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">YouTube Link</a></p>
                        )}
                        {item.pdfUrl && (
                          <p>📄 PDF: <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a></p>
                        )}
                        {item.notes && (
                          <p>📝 Notes: {item.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleContentStatus(item.id, item.isActive)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          item.isActive
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteContent(item.id)}
                        disabled={deleting === item.id}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
