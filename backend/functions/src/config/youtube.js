const { google } = require('googleapis');

const YOUTUBE_CONFIG = {
  apiKey: process.env.YOUTUBE_API_KEY,
  baseUrl: 'https://www.googleapis.com/youtube/v3',
  maxResults: 50,
  part: 'snippet,contentDetails,statistics'
};

// Initialize YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_CONFIG.apiKey
});

class YouTubeService {
  constructor() {
    this.youtube = youtube;
    this.apiKey = YOUTUBE_CONFIG.apiKey;
  }

  async getVideoDetails(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoId
      });

      if (response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      return {
        youtubeId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: {
          default: video.snippet.thumbnails.default?.url,
          medium: video.snippet.thumbnails.medium?.url,
          high: video.snippet.thumbnails.high?.url,
          maxres: video.snippet.thumbnails.maxres?.url
        },
        duration: this.parseDuration(video.contentDetails.duration),
        publishedAt: video.snippet.publishedAt,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        tags: video.snippet.tags || [],
        statistics: {
          viewCount: parseInt(video.statistics.viewCount || 0),
          likeCount: parseInt(video.statistics.likeCount || 0),
          commentCount: parseInt(video.statistics.commentCount || 0)
        }
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  async getPlaylistItems(playlistId, maxResults = 50) {
    try {
      const response = await this.youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: maxResults
      });

      const videos = [];
      for (const item of response.data.items) {
        try {
          const videoDetails = await this.getVideoDetails(item.contentDetails.videoId);
          videos.push({
            ...videoDetails,
            playlistPosition: item.snippet.position
          });
        } catch (error) {
          console.error(`Error fetching video ${item.contentDetails.videoId}:`, error);
          // Continue with other videos
        }
      }

      return videos;
    } catch (error) {
      console.error('Error fetching playlist items:', error);
      throw error;
    }
  }

  async getChannelInfo(channelId) {
    try {
      const response = await this.youtube.channels.list({
        part: 'snippet,statistics,brandingSettings',
        id: channelId
      });

      if (response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = response.data.items[0];
      return {
        channelId: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high?.url,
        subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
        videoCount: parseInt(channel.statistics.videoCount || 0),
        viewCount: parseInt(channel.statistics.viewCount || 0)
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  }

  async searchVideos(query, options = {}) {
    try {
      const searchParams = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: options.maxResults || 25,
        order: options.order || 'relevance',
        videoDuration: options.duration || 'any', // short, medium, long
        videoDefinition: options.definition || 'any' // high, standard
      };

      if (options.channelId) {
        searchParams.channelId = options.channelId;
      }

      const response = await this.youtube.search.list(searchParams);

      const videos = [];
      for (const item of response.data.items) {
        try {
          const videoDetails = await this.getVideoDetails(item.id.videoId);
          videos.push(videoDetails);
        } catch (error) {
          console.error(`Error fetching video ${item.id.videoId}:`, error);
        }
      }

      return videos;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  parseDuration(duration) {
    // Parse ISO 8601 duration format (PT4M13S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

module.exports = {
  YouTubeService,
  YOUTUBE_CONFIG
};
