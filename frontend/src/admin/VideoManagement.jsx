import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock video data
  useEffect(() => {
    setTimeout(() => {
      setVideos([
        {
          id: 1,
          title: 'Percentage Problems - Basic Concepts',
          description: 'Learn fundamental percentage calculations and applications',
          youtubeUrl: 'https://youtube.com/watch?v=abc123',
          thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',
          duration: '12:34',
          views: 15420,
          likes: 892,
          status: 'published',
          category: 'Quantitative Aptitude',
          difficulty: 'beginner',
          tags: ['percentage', 'basic', 'math'],
          uploadedBy: 'Content Team',
          uploadedAt: '2024-01-15',
          notes: [
            { time: '2:30', note: 'Important formula introduction' },
            { time: '5:45', note: 'Practice problem starts' }
          ],
          practiceQuestions: 5
        },
        {
          id: 2,
          title: 'Logical Reasoning - Syllogisms',
          description: 'Master syllogism problems with step-by-step approach',
          youtubeUrl: 'https://youtube.com/watch?v=def456',
          thumbnail: 'https://img.youtube.com/vi/def456/maxresdefault.jpg',
          duration: '18:22',
          views: 8934,
          likes: 567,
          status: 'draft',
          category: 'Logical Reasoning',
          difficulty: 'intermediate',
          tags: ['syllogism', 'logic', 'reasoning'],
          uploadedBy: 'Prof. Sharma',
          uploadedAt: '2024-01-20',
          notes: [],
          practiceQuestions: 8
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const AddVideoModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      youtubeUrl: '',
      category: '',
      difficulty: 'beginner',
      tags: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Add video logic here
      console.log('Adding video:', formData);
      setShowAddModal(false);
    };

    const extractVideoInfo = async () => {
      if (formData.youtubeUrl) {
        // Mock YouTube API call
        setFormData(prev => ({
          ...prev,
          title: 'Auto-extracted: Sample Video Title',
          description: 'Auto-extracted description from YouTube'
        }));
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
        <div className="modal max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="card-header">
            <h3 className="text-lg font-bold text-primary-900 dark:text-dark-text-primary">
              Add New Video
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                YouTube URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                  className="input flex-1"
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
                <button
                  type="button"
                  onClick={extractVideoInfo}
                  className="btn-outline"
                >
                  Extract Info
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Data Interpretation">Data Interpretation</option>
                  <option value="Verbal Ability">Verbal Ability</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input h-24"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="input"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="input"
                  placeholder="percentage, basic, math"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Video
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const BulkImportModal = () => {
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [importProgress, setImportProgress] = useState(0);
    const [importing, setImporting] = useState(false);

    const handleBulkImport = async (e) => {
      e.preventDefault();
      setImporting(true);
      
      // Mock import process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setImportProgress(i);
      }
      
      setImporting(false);
      setShowBulkImport(false);
    };

    return (
      <div className="modal-overlay" onClick={() => setShowBulkImport(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="card-header">
            <h3 className="text-lg font-bold text-primary-900 dark:text-dark-text-primary">
              Bulk Import from YouTube Playlist
            </h3>
          </div>
          
          <form onSubmit={handleBulkImport} className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                YouTube Playlist URL
              </label>
              <input
                type="url"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="input"
                placeholder="https://youtube.com/playlist?list=..."
                required
              />
            </div>

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing videos...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowBulkImport(false)}
                className="btn-outline"
                disabled={importing}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={importing}
              >
                {importing ? 'Importing...' : 'Import Playlist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredVideos = videos.filter(video => {
    const matchesFilter = filter === 'all' || video.status === filter;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for videos:`, selectedVideos);
    setSelectedVideos([]);
  };

  if (loading) {
    return (
      <AdminLayout currentPage="videos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-primary-600 dark:text-dark-text-secondary">Loading videos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="videos">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary">
              Video Management
            </h1>
            <p className="text-primary-600 dark:text-dark-text-secondary">
              Manage your video content and YouTube imports
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkImport(true)}
              className="btn-outline"
            >
              📥 Bulk Import
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              ➕ Add Video
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
            </select>

            {selectedVideos.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="btn-primary btn-sm"
                >
                  Publish ({selectedVideos.length})
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-outline btn-sm text-error-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="card overflow-hidden">
              {/* Video Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                  }}
                />
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>

                {/* Status Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                  video.status === 'published' 
                    ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                    : video.status === 'draft'
                    ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300'
                    : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                }`}>
                  {video.status}
                </div>

                {/* Selection Checkbox */}
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVideos([...selectedVideos, video.id]);
                      } else {
                        setSelectedVideos(selectedVideos.filter(id => id !== video.id));
                      }
                    }}
                    className="w-4 h-4 text-accent-600 bg-white border-2 border-gray-300 rounded focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-bold text-primary-900 dark:text-dark-text-primary mb-2 line-clamp-2">
                  {video.title}
                </h3>
                
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary mb-3 line-clamp-2">
                  {video.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-primary-500 dark:text-dark-text-secondary mb-3">
                  <span>👁 {video.views.toLocaleString()}</span>
                  <span>👍 {video.likes.toLocaleString()}</span>
                  <span>📝 {video.practiceQuestions} questions</span>
                </div>

                {/* Category and Difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <span className="badge badge-primary text-xs">
                    {video.category}
                  </span>
                  <span className={`badge text-xs ${
                    video.difficulty === 'beginner' ? 'badge-success' :
                    video.difficulty === 'intermediate' ? 'badge-primary' : 'badge-error'
                  }`}>
                    {video.difficulty}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="btn-outline btn-sm flex-1">
                    ✏️ Edit
                  </button>
                  <button className="btn-primary btn-sm flex-1">
                    👁 View
                  </button>
                  <button className="btn-outline btn-sm px-3 text-error-600">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
              No videos found
            </h3>
            <p className="text-primary-600 dark:text-dark-text-secondary mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first video'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Video
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddVideoModal />}
      {showBulkImport && <BulkImportModal />}
    </AdminLayout>
  );
};

export default VideoManagement;
