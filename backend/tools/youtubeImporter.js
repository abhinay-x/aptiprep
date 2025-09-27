const admin = require('firebase-admin');
const { YouTubeService } = require('../functions/src/config/youtube');
const readline = require('readline');

// Initialize Firebase Admin SDK
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'aptiprep-learning-platform'
});

const db = admin.firestore();
const youtubeService = new YouTubeService();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class YouTubeImporter {
  constructor() {
    this.db = db;
    this.youtube = youtubeService;
  }

  async importSingleVideo(youtubeId, options = {}) {
    try {
      console.log(`📹 Importing video: ${youtubeId}`);
      
      // Get video details from YouTube API
      const videoData = await this.youtube.getVideoDetails(youtubeId);
      
      // Create video document
      const videoDoc = {
        ...videoData,
        category: options.category || 'general',
        subcategory: options.subcategory || '',
        level: options.level || 'beginner',
        tags: options.tags || [],
        instructor: {
          name: videoData.channelTitle,
          channelId: videoData.channelId,
          bio: '',
          avatar: ''
        },
        content: {
          topics: options.topics || [],
          learningObjectives: options.learningObjectives || []
        },
        resources: {
          notes: [],
          practiceQuestions: []
        },
        stats: {
          views: 0,
          likes: 0,
          dislikes: 0,
          averageWatchTime: 0,
          completionRate: 0
        },
        isActive: true,
        createdBy: 'youtube-importer',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Save to Firestore
      const videoRef = await this.db.collection('videos').add(videoDoc);
      await videoRef.update({ videoId: videoRef.id });

      console.log(`✅ Video imported successfully: ${videoRef.id}`);
      return { success: true, videoId: videoRef.id, videoData };
    } catch (error) {
      console.error(`❌ Error importing video ${youtubeId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async importPlaylist(youtubePlaylistId, options = {}) {
    try {
      console.log(`📺 Importing playlist: ${youtubePlaylistId}`);
      
      // Get playlist videos from YouTube API
      const videos = await this.youtube.getPlaylistItems(youtubePlaylistId);
      
      if (videos.length === 0) {
        throw new Error('No videos found in playlist');
      }

      console.log(`Found ${videos.length} videos in playlist`);

      // Create playlist document
      const playlistDoc = {
        title: options.title || `Imported Playlist - ${Date.now()}`,
        description: options.description || '',
        thumbnail: videos[0]?.thumbnail?.high || '',
        category: options.category || 'general',
        subcategory: options.subcategory || '',
        level: options.level || 'beginner',
        tags: options.tags || [],
        videos: [],
        totalVideos: videos.length,
        totalDuration: videos.reduce((sum, video) => sum + video.duration, 0),
        instructor: options.instructor || {
          name: videos[0]?.channelTitle || 'Unknown',
          bio: '',
          avatar: ''
        },
        stats: {
          enrolledUsers: 0,
          completionRate: 0,
          averageRating: 0,
          totalRatings: 0
        },
        resources: {
          notes: [],
          practiceSheets: []
        },
        isPublic: options.isPublic !== false,
        createdBy: 'youtube-importer',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Create playlist
      const playlistRef = await this.db.collection('playlists').add(playlistDoc);
      const playlistId = playlistRef.id;
      await playlistRef.update({ playlistId });

      console.log(`📝 Created playlist: ${playlistId}`);

      // Import videos and update playlist
      const batch = this.db.batch();
      const playlistVideos = [];
      let successCount = 0;

      for (let i = 0; i < videos.length; i++) {
        try {
          const video = videos[i];
          
          console.log(`  📹 Processing video ${i + 1}/${videos.length}: ${video.title}`);
          
          // Create video document
          const videoDoc = {
            ...video,
            category: options.category || 'general',
            subcategory: options.subcategory || '',
            level: options.level || 'beginner',
            tags: options.tags || [],
            instructor: {
              name: video.channelTitle,
              channelId: video.channelId,
              bio: '',
              avatar: ''
            },
            content: {
              topics: [],
              learningObjectives: []
            },
            resources: {
              notes: [],
              practiceQuestions: []
            },
            stats: {
              views: 0,
              likes: 0,
              dislikes: 0,
              averageWatchTime: 0,
              completionRate: 0
            },
            isActive: true,
            createdBy: 'youtube-importer',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };

          const videoRef = this.db.collection('videos').doc();
          batch.set(videoRef, { ...videoDoc, videoId: videoRef.id });

          // Add to playlist videos array
          playlistVideos.push({
            videoId: videoRef.id,
            youtubeId: video.youtubeId,
            title: video.title,
            duration: video.duration,
            order: i + 1,
            isRequired: true,
            watchTime: 0,
            isCompleted: false
          });

          successCount++;
        } catch (error) {
          console.error(`  ❌ Failed to process video ${i + 1}: ${error.message}`);
        }
      }

      // Update playlist with videos
      batch.update(playlistRef, { 
        videos: playlistVideos,
        totalVideos: successCount
      });

      // Commit batch
      await batch.commit();

      console.log(`✅ Playlist imported successfully: ${playlistId}`);
      console.log(`   📊 ${successCount}/${videos.length} videos imported`);
      
      return { 
        success: true, 
        playlistId,
        videosImported: successCount,
        totalVideos: videos.length
      };
    } catch (error) {
      console.error(`❌ Error importing playlist ${youtubePlaylistId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async importChannel(channelId, options = {}) {
    try {
      console.log(`📺 Importing channel: ${channelId}`);
      
      // Get channel info
      const channelInfo = await this.youtube.getChannelInfo(channelId);
      console.log(`Channel: ${channelInfo.title}`);
      console.log(`Videos: ${channelInfo.videoCount}`);

      // Search for educational videos from this channel
      const searchQuery = options.searchQuery || 'tutorial lesson';
      const videos = await this.youtube.searchVideos(searchQuery, {
        channelId: channelId,
        maxResults: options.maxResults || 50,
        duration: options.duration || 'medium' // short, medium, long
      });

      console.log(`Found ${videos.length} videos matching criteria`);

      if (videos.length === 0) {
        return { success: false, error: 'No videos found matching criteria' };
      }

      // Create playlist for channel videos
      const playlistResult = await this.importPlaylist(null, {
        title: options.playlistTitle || `${channelInfo.title} - Educational Content`,
        description: options.description || `Educational videos from ${channelInfo.title}`,
        category: options.category || 'general',
        subcategory: options.subcategory || '',
        level: options.level || 'beginner',
        tags: options.tags || [],
        instructor: {
          name: channelInfo.title,
          bio: `Content creator with ${channelInfo.subscriberCount} subscribers`,
          avatar: channelInfo.thumbnail
        },
        isPublic: options.isPublic !== false
      });

      return playlistResult;
    } catch (error) {
      console.error(`❌ Error importing channel ${channelId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async searchAndImport(query, options = {}) {
    try {
      console.log(`🔍 Searching for: "${query}"`);
      
      const videos = await this.youtube.searchVideos(query, {
        maxResults: options.maxResults || 25,
        duration: options.duration || 'medium',
        order: options.order || 'relevance'
      });

      console.log(`Found ${videos.length} videos`);

      if (videos.length === 0) {
        return { success: false, error: 'No videos found' };
      }

      // Show results and let user choose
      console.log('\nSearch Results:');
      videos.forEach((video, index) => {
        console.log(`${index + 1}. ${video.title}`);
        console.log(`   Duration: ${this.formatDuration(video.duration)}`);
        console.log(`   Channel: ${video.channelTitle}`);
        console.log(`   Views: ${video.statistics.viewCount}`);
        console.log('');
      });

      // Ask user which videos to import
      const answer = await this.askQuestion('Enter video numbers to import (comma-separated, or "all"): ');
      
      let videosToImport = [];
      if (answer.toLowerCase() === 'all') {
        videosToImport = videos;
      } else {
        const indices = answer.split(',').map(n => parseInt(n.trim()) - 1);
        videosToImport = indices.filter(i => i >= 0 && i < videos.length).map(i => videos[i]);
      }

      console.log(`Importing ${videosToImport.length} videos...`);

      // Import selected videos
      const results = [];
      for (const video of videosToImport) {
        const result = await this.importSingleVideo(video.youtubeId, options);
        results.push(result);
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Import completed: ${successCount}/${videosToImport.length} videos imported successfully`);

      return { success: true, imported: successCount, total: videosToImport.length };
    } catch (error) {
      console.error(`❌ Error in search and import:`, error.message);
      return { success: false, error: error.message };
    }
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

  askQuestion(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  async interactiveImport() {
    console.log('🎬 YouTube Content Importer for Aptiprep');
    console.log('=====================================\n');

    try {
      while (true) {
        console.log('Choose an option:');
        console.log('1. Import single video');
        console.log('2. Import playlist');
        console.log('3. Import from channel');
        console.log('4. Search and import');
        console.log('5. Exit');

        const choice = await this.askQuestion('\nEnter your choice (1-5): ');

        switch (choice) {
          case '1':
            await this.handleSingleVideoImport();
            break;
          case '2':
            await this.handlePlaylistImport();
            break;
          case '3':
            await this.handleChannelImport();
            break;
          case '4':
            await this.handleSearchImport();
            break;
          case '5':
            console.log('👋 Goodbye!');
            rl.close();
            process.exit(0);
            break;
          default:
            console.log('❌ Invalid choice. Please try again.\n');
        }

        console.log('\n' + '='.repeat(50) + '\n');
      }
    } catch (error) {
      console.error('❌ Error in interactive import:', error);
      rl.close();
      process.exit(1);
    }
  }

  async handleSingleVideoImport() {
    const youtubeId = await this.askQuestion('Enter YouTube video ID or URL: ');
    const category = await this.askQuestion('Enter category (default: general): ') || 'general';
    const level = await this.askQuestion('Enter level (beginner/intermediate/advanced): ') || 'beginner';
    
    const videoId = this.extractVideoId(youtubeId);
    const result = await this.importSingleVideo(videoId, { category, level });
    
    if (result.success) {
      console.log(`✅ Video imported with ID: ${result.videoId}`);
    }
  }

  async handlePlaylistImport() {
    const playlistId = await this.askQuestion('Enter YouTube playlist ID or URL: ');
    const title = await this.askQuestion('Enter playlist title: ');
    const category = await this.askQuestion('Enter category (default: general): ') || 'general';
    const level = await this.askQuestion('Enter level (beginner/intermediate/advanced): ') || 'beginner';
    
    const extractedId = this.extractPlaylistId(playlistId);
    const result = await this.importPlaylist(extractedId, { title, category, level });
    
    if (result.success) {
      console.log(`✅ Playlist imported with ID: ${result.playlistId}`);
    }
  }

  async handleChannelImport() {
    const channelId = await this.askQuestion('Enter YouTube channel ID or URL: ');
    const searchQuery = await this.askQuestion('Enter search query for videos (default: tutorial): ') || 'tutorial';
    const maxResults = parseInt(await this.askQuestion('Max videos to import (default: 25): ') || '25');
    
    const extractedId = this.extractChannelId(channelId);
    const result = await this.importChannel(extractedId, { searchQuery, maxResults });
    
    if (result.success) {
      console.log(`✅ Channel content imported`);
    }
  }

  async handleSearchImport() {
    const query = await this.askQuestion('Enter search query: ');
    const maxResults = parseInt(await this.askQuestion('Max results to show (default: 10): ') || '10');
    const category = await this.askQuestion('Enter category (default: general): ') || 'general';
    
    await this.searchAndImport(query, { maxResults, category });
  }

  extractVideoId(input) {
    // Extract video ID from URL or return as-is if already an ID
    const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
  }

  extractPlaylistId(input) {
    // Extract playlist ID from URL or return as-is if already an ID
    const match = input.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input;
  }

  extractChannelId(input) {
    // Extract channel ID from URL or return as-is if already an ID
    const match = input.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input;
  }
}

// Run interactive import if called directly
if (require.main === module) {
  const importer = new YouTubeImporter();
  importer.interactiveImport();
}

module.exports = YouTubeImporter;
