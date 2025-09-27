import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const PlaylistManagement = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCurriculumBuilder, setShowCurriculumBuilder] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock playlist data
  useEffect(() => {
    setTimeout(() => {
      setPlaylists([
        {
          id: 1,
          title: 'Complete Quantitative Aptitude',
          description: 'Comprehensive course covering all QA topics',
          thumbnail: 'https://img.youtube.com/vi/sample1/maxresdefault.jpg',
          videoCount: 25,
          totalDuration: '8h 45m',
          enrolledStudents: 1250,
          completionRate: 78.5,
          status: 'published',
          category: 'Quantitative Aptitude',
          difficulty: 'beginner',
          createdBy: 'Prof. Sharma',
          createdAt: '2024-01-10',
          lastUpdated: '2024-01-20',
          tags: ['math', 'aptitude', 'complete'],
          isScheduled: false,
          releaseDate: null,
          videos: [
            { id: 1, title: 'Number System Basics', duration: '12:34', order: 1 },
            { id: 2, title: 'Percentage Problems', duration: '15:22', order: 2 },
            { id: 3, title: 'Profit and Loss', duration: '18:45', order: 3 }
          ]
        },
        {
          id: 2,
          title: 'CAT Preparation 2024',
          description: 'Complete preparation roadmap for CAT 2024',
          thumbnail: 'https://img.youtube.com/vi/sample2/maxresdefault.jpg',
          videoCount: 45,
          totalDuration: '15h 30m',
          enrolledStudents: 2340,
          completionRate: 65.2,
          status: 'draft',
          category: 'CAT Preparation',
          difficulty: 'advanced',
          createdBy: 'Content Team',
          createdAt: '2024-01-15',
          lastUpdated: '2024-01-22',
          tags: ['cat', 'preparation', '2024'],
          isScheduled: true,
          releaseDate: '2024-02-01',
          videos: []
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const CreatePlaylistModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      tags: '',
      isScheduled: false,
      releaseDate: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Creating playlist:', formData);
      setShowCreateModal(false);
    };

    return (
      <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
        <div className="modal max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="card-header">
            <h3 className="text-lg font-bold text-primary-900 dark:text-dark-text-primary">
              Create New Playlist
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                  Playlist Title
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
                  <option value="CAT Preparation">CAT Preparation</option>
                  <option value="Placement Preparation">Placement Preparation</option>
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
                  Difficulty Level
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
                  placeholder="math, aptitude, complete"
                />
              </div>
            </div>

            {/* Scheduling Options */}
            <div className="border-t border-primary-200 dark:border-dark-border pt-4">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="scheduled"
                  checked={formData.isScheduled}
                  onChange={(e) => setFormData({...formData, isScheduled: e.target.checked})}
                  className="w-4 h-4 text-accent-600 bg-white border-2 border-gray-300 rounded focus:ring-accent-500"
                />
                <label htmlFor="scheduled" className="text-sm font-medium text-primary-700 dark:text-dark-text-primary">
                  Schedule for later release
                </label>
              </div>

              {formData.isScheduled && (
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                    Release Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                    className="input"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Playlist
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CurriculumBuilderModal = () => {
    const [availableVideos] = useState([
      { id: 1, title: 'Number System Basics', duration: '12:34', category: 'QA' },
      { id: 2, title: 'Percentage Problems', duration: '15:22', category: 'QA' },
      { id: 3, title: 'Profit and Loss', duration: '18:45', category: 'QA' },
      { id: 4, title: 'Syllogisms', duration: '20:15', category: 'LR' },
      { id: 5, title: 'Data Sufficiency', duration: '16:30', category: 'LR' }
    ]);

    const [selectedVideos, setSelectedVideos] = useState(
      selectedPlaylist?.videos || []
    );

    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, video) => {
      setDraggedItem(video);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
      e.preventDefault();
      if (!draggedItem) return;

      const newVideos = [...selectedVideos];
      const draggedIndex = newVideos.findIndex(v => v.id === draggedItem.id);
      
      if (draggedIndex !== -1) {
        // Reorder existing video
        newVideos.splice(draggedIndex, 1);
        newVideos.splice(targetIndex, 0, draggedItem);
      } else {
        // Add new video
        newVideos.splice(targetIndex, 0, { ...draggedItem, order: targetIndex + 1 });
      }

      // Update order numbers
      newVideos.forEach((video, index) => {
        video.order = index + 1;
      });

      setSelectedVideos(newVideos);
      setDraggedItem(null);
    };

    const addVideo = (video) => {
      if (!selectedVideos.find(v => v.id === video.id)) {
        setSelectedVideos([...selectedVideos, { ...video, order: selectedVideos.length + 1 }]);
      }
    };

    const removeVideo = (videoId) => {
      setSelectedVideos(selectedVideos.filter(v => v.id !== videoId));
    };

    return (
      <div className="modal-overlay" onClick={() => setShowCurriculumBuilder(false)}>
        <div className="modal max-w-6xl" onClick={e => e.stopPropagation()}>
          <div className="card-header">
            <h3 className="text-lg font-bold text-primary-900 dark:text-dark-text-primary">
              Curriculum Builder - {selectedPlaylist?.title}
            </h3>
          </div>
          
          <div className="card-body">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Available Videos */}
              <div>
                <h4 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                  Available Videos
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableVideos.map((video) => (
                    <div
                      key={video.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, video)}
                      className="p-3 bg-primary-50 dark:bg-dark-secondary rounded-lg border border-primary-200 dark:border-dark-border cursor-move hover:bg-primary-100 dark:hover:bg-dark-card transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-primary-900 dark:text-dark-text-primary text-sm">
                            {video.title}
                          </h5>
                          <p className="text-xs text-primary-600 dark:text-dark-text-secondary">
                            {video.category} • {video.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => addVideo(video)}
                          className="btn-primary btn-sm ml-2"
                          disabled={selectedVideos.find(v => v.id === video.id)}
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum Structure */}
              <div>
                <h4 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                  Curriculum Structure
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedVideos.length === 0 ? (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 0)}
                      className="p-8 border-2 border-dashed border-primary-300 dark:border-dark-border rounded-lg text-center"
                    >
                      <p className="text-primary-500 dark:text-dark-text-secondary">
                        Drag videos here to build your curriculum
                      </p>
                    </div>
                  ) : (
                    selectedVideos.map((video, index) => (
                      <div
                        key={video.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, video)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="p-3 bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 dark:text-accent-400">
                              {video.order}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-primary-900 dark:text-dark-text-primary text-sm">
                                {video.title}
                              </h5>
                              <p className="text-xs text-primary-600 dark:text-dark-text-secondary">
                                {video.duration}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeVideo(video.id)}
                            className="text-error-600 hover:text-error-700 p-1"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-primary-200 dark:border-dark-border mt-6">
              <button
                onClick={() => setShowCurriculumBuilder(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Save Curriculum
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredPlaylists = playlists.filter(playlist => {
    const matchesFilter = filter === 'all' || playlist.status === filter;
    const matchesSearch = playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout currentPage="playlists">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-primary-600 dark:text-dark-text-secondary">Loading playlists...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="playlists">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary">
              Playlist Management
            </h1>
            <p className="text-primary-600 dark:text-dark-text-secondary">
              Create and manage learning paths and video playlists
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button className="btn-outline">
              📊 Analytics
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              ➕ Create Playlist
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search playlists..."
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
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="card overflow-hidden">
              {/* Playlist Header */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-accent-400 to-accent-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-sm font-medium">{playlist.videoCount} Videos</div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                  playlist.status === 'published' 
                    ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                    : playlist.status === 'draft'
                    ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300'
                    : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                }`}>
                  {playlist.status}
                </div>

                {playlist.isScheduled && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                    📅 Scheduled
                  </div>
                )}
              </div>

              {/* Playlist Info */}
              <div className="p-6">
                <h3 className="font-bold text-primary-900 dark:text-dark-text-primary mb-2">
                  {playlist.title}
                </h3>
                
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary mb-4 line-clamp-2">
                  {playlist.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-primary-50 dark:bg-dark-secondary rounded-lg">
                    <div className="text-lg font-bold text-primary-900 dark:text-dark-text-primary">
                      {playlist.enrolledStudents.toLocaleString()}
                    </div>
                    <div className="text-xs text-primary-600 dark:text-dark-text-secondary">
                      Students
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-primary-50 dark:bg-dark-secondary rounded-lg">
                    <div className="text-lg font-bold text-primary-900 dark:text-dark-text-primary">
                      {playlist.completionRate}%
                    </div>
                    <div className="text-xs text-primary-600 dark:text-dark-text-secondary">
                      Completion
                    </div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-primary-500 dark:text-dark-text-secondary mb-4">
                  <span>⏱ {playlist.totalDuration}</span>
                  <span className={`badge text-xs ${
                    playlist.difficulty === 'beginner' ? 'badge-success' :
                    playlist.difficulty === 'intermediate' ? 'badge-primary' : 'badge-error'
                  }`}>
                    {playlist.difficulty}
                  </span>
                </div>

                <div className="text-xs text-primary-500 dark:text-dark-text-secondary mb-4">
                  Created by {playlist.createdBy} • {playlist.createdAt}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setShowCurriculumBuilder(true);
                    }}
                    className="btn-primary btn-sm flex-1"
                  >
                    📝 Edit Curriculum
                  </button>
                  <button className="btn-outline btn-sm flex-1">
                    👁 Preview
                  </button>
                  <button className="btn-outline btn-sm px-3">
                    📊
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlaylists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
              No playlists found
            </h3>
            <p className="text-primary-600 dark:text-dark-text-secondary mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first playlist to organize your content'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Playlist
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreatePlaylistModal />}
      {showCurriculumBuilder && <CurriculumBuilderModal />}
    </AdminLayout>
  );
};

export default PlaylistManagement;
