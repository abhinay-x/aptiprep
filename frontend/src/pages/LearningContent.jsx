import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import YouTubePlayer from '../components/YouTubePlayer';
import CustomVideoPlayer from '../components/CustomVideoPlayer';

const CONTENT_TYPES = [
  { value: 'youtube', label: 'YouTube Video', icon: '📹' },
  { value: 'document', label: 'Document', icon: '📄' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'link', label: 'External Link', icon: '🔗' }
];

export default function LearningContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      // Query without orderBy to avoid composite index requirement
      const snapshot = await getDocs(collection(db, 'lmsContent'));
      const contentList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Filter for active content and sort in memory
        .filter(item => item.isActive === true)
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return bTime - aTime; // Most recent first
        });
      setContent(contentList);
    } catch (err) {
      setError('Failed to load learning content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueTagsFromContent = () => {
    const allTags = content.flatMap(item => item.tags || []);
    return [...new Set(allTags)].sort();
  };

  const filteredContent = content.filter(item => {
    const matchesTag = selectedTag === 'all' || item.tags?.includes(selectedTag);
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTag && matchesSearch;
  });

  const extractYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
  };

  const getContentIcon = (contentType) => {
    const icons = {
      youtube: '📹',
      document: '📄',
      image: '🖼️',
      link: '🔗'
    };
    return icons[contentType] || '📚';
  };

  const isGoogleDriveUrl = (url) => {
    return url && url.includes('drive.google.com');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Learning Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our comprehensive learning materials and resources
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search content by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Tag Filter */}
            <div className="md:w-64">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {getUniqueTagsFromContent().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedTag !== 'all' || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTag !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Category: {selectedTag}
                  <button
                    onClick={() => setSelectedTag('all')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredContent.length} of {content.length} resources
          </p>
        </div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedTag !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No learning content is available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map(item => {
              const videoId = item.contentType === 'youtube' && item.contentUrl ? extractYouTubeVideoId(item.contentUrl) : null;
              const contentUrl = item.contentUrl || item.fileUrl;

              return (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                  {/* Content Preview - All videos use custom player */}
                  {videoId ? (
                    <CustomVideoPlayer
                      src={getYouTubeEmbedUrl(videoId)}
                      title={item.title}
                      className="w-full"
                    />
                  ) : item.fileUrl && item.fileType?.startsWith('video/') ? (
                    <CustomVideoPlayer
                      src={item.fileUrl}
                      title={item.title}
                      className="w-full"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-t-lg flex items-center justify-center">
                      <div className="text-6xl">{getContentIcon(item.contentType)}</div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Content Type Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {CONTENT_TYPES.find(type => type.value === item.contentType)?.label || item.contentType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags?.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          📝 {item.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {contentUrl && contentUrl !== '#' && !videoId && !item.fileType?.startsWith('video/') && (
                        <a
                          href={contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2 text-center rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {item.contentType === 'document' ? '📄 View Document' :
                           item.contentType === 'image' ? '🖼️ View Image' :
                           '🔗 Open Link'}
                        </a>
                      )}

                      {(videoId || item.fileType?.startsWith('video/')) && (
                        <button className="w-full px-4 py-2 text-center rounded-lg text-sm font-medium bg-green-600 text-white cursor-default">
                          ▶️ Video Player Above
                        </button>
                      )}

                      {/* Google Drive specific handling */}
                      {isGoogleDriveUrl(contentUrl) && !videoId && !item.fileType?.startsWith('video/') && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <p>💡 Tip: For Google Drive links, make sure sharing is set to "Anyone with the link can view"</p>
                        </div>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
