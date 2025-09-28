import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import YouTubeCustomPlayer from '../components/YouTubeCustomPlayer';

export default function Courses() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('all');

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
      setError('Failed to load courses');
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
    return selectedTag === 'all' || item.tags?.includes(selectedTag);
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

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      case 'intermediate': return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
      case 'advanced': return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
      default: return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchContent}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">📚 Learning Content</h1>
          <p className="text-primary-600 dark:text-dark-text-secondary">Master aptitude skills with our comprehensive learning materials</p>
        </div>

        {/* Filter by Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({content.length})
            </button>
            {getUniqueTagsFromContent().map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag} ({content.filter(c => c.tags?.includes(tag)).length})
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTag !== 'all' 
                ? `No content available for ${selectedTag}`
                : 'No learning content is available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map(item => {
              const videoId = item.contentType === 'youtube' && item.contentUrl ? extractYouTubeVideoId(item.contentUrl) : null;
              const contentUrl = item.contentUrl || item.fileUrl;

              return (
                <div key={item.id} className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Content Preview - Play uploaded MP4s or YouTube inline */}
                  {item.fileUrl && item.fileType?.startsWith('video/') ? (
                    <CustomVideoPlayer
                      src={item.fileUrl}
                      title={item.title}
                      className="w-full"
                    />
                  ) : videoId ? (
                    <YouTubeCustomPlayer
                      videoId={videoId}
                      title={item.title}
                      className="w-full"
                    />
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                      <span className="text-6xl">{getContentIcon(item.contentType)}</span>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                          {item.contentType === 'document' ? '📄 Document' :
                           item.contentType === 'image' ? '🖼️ Image' :
                           item.contentType === 'link' ? '🔗 Link' : '📚 Content'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-dark-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-dark-text-secondary mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Creator and Date */}
                    <div className="text-xs text-primary-600 dark:text-dark-text-secondary mb-4">
                      👤 {item.createdByName || 'Admin'} • 📅 {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                    </div>

                    {/* Notes Preview */}
                    {item.notes && (
                      <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                        📝 {item.notes.substring(0, 100)}{item.notes.length > 100 ? '...' : ''}
                      </div>
                    )}

                    {/* Action Button - Different for different content types */}
                    {contentUrl && !videoId && !item.fileType?.startsWith('video/') ? (
                      <a
                        href={contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full"
                      >
                        {item.contentType === 'document' ? '📄 View Document' :
                         item.contentType === 'image' ? '🖼️ View Image' :
                         '🔗 Open Link'}
                      </a>
                    ) : (videoId || item.fileType?.startsWith('video/')) ? (
                      <button className="btn-primary w-full cursor-default">
                        ▶️ Video Player Above
                      </button>
                    ) : (
                      <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>
                        No Content Available
                      </button>
                    )}
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
