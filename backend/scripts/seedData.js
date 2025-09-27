const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../service-account-key.json'); // You'll need to add this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'aptiprep-learning-platform'
});

const db = admin.firestore();

// Sample company data
const companies = [
  {
    name: "Tata Consultancy Services",
    shortName: "TCS",
    logo: "https://example.com/logos/tcs.png",
    description: "Leading IT services, consulting and business solutions company",
    industry: "Information Technology",
    headquarters: "Mumbai, India",
    website: "https://tcs.com",
    aptitudeInfo: {
      testPattern: {
        sections: [
          {
            name: "Quantitative Aptitude",
            questions: 30,
            timeLimit: 40,
            topics: ["arithmetic", "algebra", "geometry", "data-interpretation"]
          },
          {
            name: "Logical Reasoning",
            questions: 25,
            timeLimit: 35,
            topics: ["verbal-reasoning", "analytical-reasoning", "pattern-recognition"]
          },
          {
            name: "Verbal Ability",
            questions: 20,
            timeLimit: 25,
            topics: ["reading-comprehension", "grammar", "vocabulary"]
          }
        ],
        totalQuestions: 75,
        totalTime: 100,
        cutoffPercentage: 65
      },
      difficulty: "medium",
      syllabus: [
        "percentages", "profit-loss", "time-work", "time-distance",
        "simple-interest", "compound-interest", "ratio-proportion",
        "number-system", "algebra", "geometry", "data-interpretation"
      ],
      tips: "Focus on accuracy over speed. Practice time management extensively."
    },
    isActive: true
  },
  {
    name: "Infosys Limited",
    shortName: "Infosys",
    logo: "https://example.com/logos/infosys.png",
    description: "Global leader in next-generation digital services and consulting",
    industry: "Information Technology",
    headquarters: "Bangalore, India",
    website: "https://infosys.com",
    aptitudeInfo: {
      testPattern: {
        sections: [
          {
            name: "Quantitative Aptitude",
            questions: 35,
            timeLimit: 45,
            topics: ["arithmetic", "algebra", "geometry"]
          },
          {
            name: "Logical Reasoning",
            questions: 30,
            timeLimit: 40,
            topics: ["logical-reasoning", "analytical-reasoning"]
          },
          {
            name: "Verbal Ability",
            questions: 25,
            timeLimit: 35,
            topics: ["reading-comprehension", "grammar"]
          }
        ],
        totalQuestions: 90,
        totalTime: 120,
        cutoffPercentage: 70
      },
      difficulty: "medium-hard",
      syllabus: [
        "advanced-arithmetic", "algebra", "geometry", "probability",
        "logical-reasoning", "data-sufficiency", "reading-comprehension"
      ],
      tips: "Strong focus on logical reasoning and verbal ability. Practice mock tests regularly."
    },
    isActive: true
  },
  {
    name: "Wipro Limited",
    shortName: "Wipro",
    logo: "https://example.com/logos/wipro.png",
    description: "Leading technology services and consulting company",
    industry: "Information Technology",
    headquarters: "Bangalore, India",
    website: "https://wipro.com",
    aptitudeInfo: {
      testPattern: {
        sections: [
          {
            name: "Quantitative Aptitude",
            questions: 25,
            timeLimit: 30,
            topics: ["arithmetic", "algebra"]
          },
          {
            name: "Logical Reasoning",
            questions: 25,
            timeLimit: 30,
            topics: ["logical-reasoning", "analytical-reasoning"]
          },
          {
            name: "Verbal Ability",
            questions: 20,
            timeLimit: 20,
            topics: ["reading-comprehension", "grammar"]
          }
        ],
        totalQuestions: 70,
        totalTime: 80,
        cutoffPercentage: 60
      },
      difficulty: "medium",
      syllabus: [
        "basic-arithmetic", "percentages", "profit-loss", "time-work",
        "logical-reasoning", "verbal-ability", "reading-comprehension"
      ],
      tips: "Balanced preparation across all sections. Focus on fundamentals."
    },
    isActive: true
  }
];

// Sample playlist data
const playlists = [
  {
    title: "Complete Quantitative Aptitude Mastery",
    description: "Master all quantitative aptitude topics from basics to advanced level",
    thumbnail: "https://example.com/thumbnails/qa-mastery.jpg",
    category: "quantitative-aptitude",
    subcategory: "comprehensive",
    level: "intermediate",
    tags: ["arithmetic", "algebra", "geometry", "data-interpretation", "competitive-exam"],
    videos: [
      {
        videoId: "video-001",
        youtubeId: "dQw4w9WgXcQ", // Sample YouTube ID
        title: "Number System Fundamentals",
        duration: 1800, // 30 minutes
        order: 1,
        isRequired: true,
        watchTime: 0,
        isCompleted: false
      },
      {
        videoId: "video-002",
        youtubeId: "dQw4w9WgXcQ",
        title: "Percentage Calculations",
        duration: 1200,
        order: 2,
        isRequired: true,
        watchTime: 0,
        isCompleted: false
      },
      {
        videoId: "video-003",
        youtubeId: "dQw4w9WgXcQ",
        title: "Profit and Loss Problems",
        duration: 1500,
        order: 3,
        isRequired: true,
        watchTime: 0,
        isCompleted: false
      }
    ],
    totalVideos: 3,
    totalDuration: 4500,
    instructor: {
      name: "Prof. Rajesh Kumar",
      bio: "Mathematics expert with 15+ years of teaching experience",
      avatar: "https://example.com/avatars/prof-rajesh.jpg"
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
    isPublic: true
  },
  {
    title: "Logical Reasoning Essentials",
    description: "Build strong logical reasoning skills for competitive exams",
    thumbnail: "https://example.com/thumbnails/lr-essentials.jpg",
    category: "logical-reasoning",
    subcategory: "fundamentals",
    level: "beginner",
    tags: ["logical-reasoning", "analytical-reasoning", "pattern-recognition"],
    videos: [
      {
        videoId: "video-004",
        youtubeId: "dQw4w9WgXcQ",
        title: "Introduction to Logical Reasoning",
        duration: 900,
        order: 1,
        isRequired: true,
        watchTime: 0,
        isCompleted: false
      },
      {
        videoId: "video-005",
        youtubeId: "dQw4w9WgXcQ",
        title: "Pattern Recognition Techniques",
        duration: 1200,
        order: 2,
        isRequired: true,
        watchTime: 0,
        isCompleted: false
      }
    ],
    totalVideos: 2,
    totalDuration: 2100,
    instructor: {
      name: "Dr. Priya Sharma",
      bio: "Logical reasoning specialist and competitive exam trainer",
      avatar: "https://example.com/avatars/dr-priya.jpg"
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
    isPublic: true
  }
];

// Sample mock test data
const mockTests = [
  {
    title: "TCS Mock Test - Set 1",
    description: "Complete simulation of TCS placement test pattern",
    companyId: "", // Will be set after company creation
    type: "company-specific",
    difficulty: "medium",
    timeLimit: 100, // minutes
    sections: [
      {
        sectionId: "section-qa",
        name: "Quantitative Aptitude",
        timeLimit: 40,
        questions: 30,
        topics: ["arithmetic", "algebra", "geometry"]
      },
      {
        sectionId: "section-lr",
        name: "Logical Reasoning",
        timeLimit: 35,
        questions: 25,
        topics: ["logical-reasoning", "analytical-reasoning"]
      },
      {
        sectionId: "section-va",
        name: "Verbal Ability",
        timeLimit: 25,
        questions: 20,
        topics: ["reading-comprehension", "grammar"]
      }
    ],
    questions: [
      {
        questionId: "q-001",
        sectionId: "section-qa",
        question: "If 25% of a number is 75, what is 40% of that number?",
        options: ["100", "120", "150", "180"],
        correctAnswer: 1,
        explanation: "First find the number: 75 ÷ 0.25 = 300. Then 40% of 300 = 0.40 × 300 = 120",
        difficulty: "medium",
        topic: "percentages",
        timeToSolve: 90
      },
      {
        questionId: "q-002",
        sectionId: "section-qa",
        question: "A shopkeeper sells an article at 20% profit. If he bought it for ₹500, what is the selling price?",
        options: ["₹580", "₹600", "₹620", "₹650"],
        correctAnswer: 1,
        explanation: "Selling price = Cost price + Profit = 500 + (20% of 500) = 500 + 100 = ₹600",
        difficulty: "easy",
        topic: "profit-loss",
        timeToSolve: 60
      },
      {
        questionId: "q-003",
        sectionId: "section-lr",
        question: "In a certain code, FLOWER is written as EKNVDQ. How is GARDEN written in that code?",
        options: ["FZQCDK", "FZQCDM", "FZQCDN", "FZQCDO"],
        correctAnswer: 2,
        explanation: "Each letter is replaced by the letter that comes one position before it in the alphabet. G→F, A→Z, R→Q, D→C, E→D, N→M",
        difficulty: "medium",
        topic: "coding-decoding",
        timeToSolve: 120
      }
    ],
    instructions: [
      "Each question carries 1 mark",
      "Negative marking: -0.25 for wrong answers",
      "No penalty for unattempted questions",
      "Calculator is not allowed"
    ],
    passingCriteria: {
      minimumScore: 65,
      sectionWiseMinimum: true
    },
    isActive: true
  }
];

// Sample roadmap data
const roadmaps = [
  {
    title: "TCS Placement Preparation - Complete Roadmap",
    description: "Comprehensive 60-day preparation plan for TCS placement",
    companyId: "", // Will be set after company creation
    type: "company-specific",
    estimatedDuration: 60,
    difficulty: "intermediate",
    prerequisites: ["basic-mathematics", "logical-thinking"],
    phases: [
      {
        phaseId: "phase-1",
        title: "Foundation Building (Days 1-20)",
        description: "Master the fundamental concepts",
        duration: 20,
        order: 1,
        modules: [
          {
            moduleId: "module-1",
            title: "Quantitative Aptitude Basics",
            type: "video-series",
            playlistId: "", // Will be set after playlist creation
            estimatedTime: 300,
            isRequired: true,
            order: 1
          },
          {
            moduleId: "module-2",
            title: "Logical Reasoning Fundamentals",
            type: "video-series",
            playlistId: "", // Will be set after playlist creation
            estimatedTime: 180,
            isRequired: true,
            order: 2
          }
        ]
      },
      {
        phaseId: "phase-2",
        title: "Skill Development (Days 21-40)",
        description: "Advanced problem solving and speed building",
        duration: 20,
        order: 2,
        modules: [
          {
            moduleId: "module-3",
            title: "Advanced Problem Solving",
            type: "practice-set",
            practiceSetId: "practice-001",
            estimatedTime: 240,
            isRequired: true,
            order: 1
          }
        ]
      },
      {
        phaseId: "phase-3",
        title: "Test Preparation (Days 41-60)",
        description: "Mock tests and final preparation",
        duration: 20,
        order: 3,
        modules: [
          {
            moduleId: "module-4",
            title: "Full-Length Mock Tests",
            type: "mock-test-series",
            testSeriesId: "test-series-001",
            estimatedTime: 600,
            isRequired: true,
            order: 1
          }
        ]
      }
    ],
    skills: ["quantitative-aptitude", "logical-reasoning", "verbal-ability", "time-management"],
    learningOutcomes: [
      "Master all quantitative aptitude topics",
      "Achieve 80%+ accuracy in logical reasoning",
      "Complete mock tests within time limits",
      "Score above company cutoff consistently"
    ],
    isPublished: true
  }
];

// Seeding functions
async function seedCompanies() {
  console.log('Seeding companies...');
  const batch = db.batch();
  const companyIds = [];

  for (const company of companies) {
    const companyRef = db.collection('companies').doc();
    const companyData = {
      ...company,
      companyId: companyRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(companyRef, companyData);
    companyIds.push(companyRef.id);
  }

  await batch.commit();
  console.log(`✅ Seeded ${companies.length} companies`);
  return companyIds;
}

async function seedPlaylists() {
  console.log('Seeding playlists...');
  const batch = db.batch();
  const playlistIds = [];

  for (const playlist of playlists) {
    const playlistRef = db.collection('playlists').doc();
    const playlistData = {
      ...playlist,
      playlistId: playlistRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(playlistRef, playlistData);
    playlistIds.push(playlistRef.id);
  }

  await batch.commit();
  console.log(`✅ Seeded ${playlists.length} playlists`);
  return playlistIds;
}

async function seedVideos() {
  console.log('Seeding videos...');
  const batch = db.batch();
  const videoIds = [];

  // Create videos from playlist data
  for (const playlist of playlists) {
    for (const video of playlist.videos) {
      const videoRef = db.collection('videos').doc();
      const videoData = {
        videoId: videoRef.id,
        youtubeId: video.youtubeId,
        title: video.title,
        description: `Learn ${video.title} - Part of ${playlist.title}`,
        thumbnail: {
          default: "https://img.youtube.com/vi/" + video.youtubeId + "/default.jpg",
          medium: "https://img.youtube.com/vi/" + video.youtubeId + "/mqdefault.jpg",
          high: "https://img.youtube.com/vi/" + video.youtubeId + "/hqdefault.jpg"
        },
        duration: video.duration,
        publishedAt: new Date().toISOString(),
        category: playlist.category,
        subcategory: playlist.subcategory,
        tags: playlist.tags,
        level: playlist.level,
        instructor: playlist.instructor,
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      batch.set(videoRef, videoData);
      videoIds.push(videoRef.id);
    }
  }

  await batch.commit();
  console.log(`✅ Seeded ${videoIds.length} videos`);
  return videoIds;
}

async function seedMockTests(companyIds) {
  console.log('Seeding mock tests...');
  const batch = db.batch();

  for (let i = 0; i < mockTests.length; i++) {
    const test = mockTests[i];
    const testRef = db.collection('mockTests').doc();
    const testData = {
      ...test,
      testId: testRef.id,
      companyId: companyIds[0], // Assign to first company (TCS)
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(testRef, testData);
  }

  await batch.commit();
  console.log(`✅ Seeded ${mockTests.length} mock tests`);
}

async function seedRoadmaps(companyIds, playlistIds) {
  console.log('Seeding roadmaps...');
  const batch = db.batch();

  for (let i = 0; i < roadmaps.length; i++) {
    const roadmap = roadmaps[i];
    const roadmapRef = db.collection('roadmaps').doc();
    
    // Update module playlist IDs
    const updatedPhases = roadmap.phases.map(phase => ({
      ...phase,
      modules: phase.modules.map((module, moduleIndex) => ({
        ...module,
        playlistId: module.type === 'video-series' ? playlistIds[moduleIndex] || playlistIds[0] : module.playlistId
      }))
    }));

    const roadmapData = {
      ...roadmap,
      roadmapId: roadmapRef.id,
      companyId: companyIds[0], // Assign to first company (TCS)
      phases: updatedPhases,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(roadmapRef, roadmapData);
  }

  await batch.commit();
  console.log(`✅ Seeded ${roadmaps.length} roadmaps`);
}

async function createAdminUser() {
  console.log('Creating admin user...');
  
  const adminUserData = {
    userId: 'admin-user-001',
    email: 'admin@aptiprep.co.in',
    displayName: 'Admin User',
    photoURL: '',
    role: 'admin',
    profile: {
      fullName: 'Admin User',
      phone: '+91-9999999999',
      college: 'Aptiprep',
      graduationYear: null,
      targetCompanies: [],
      goals: ['platform-management'],
      bio: 'Platform administrator'
    },
    preferences: {
      theme: 'light',
      notifications: true,
      emailUpdates: true,
      studyReminders: false,
      language: 'en'
    },
    gamification: {
      totalXP: 10000,
      currentStreak: 0,
      longestStreak: 0,
      level: 10,
      badges: ['admin', 'founder'],
      achievements: []
    },
    subscription: {
      plan: 'enterprise',
      startDate: admin.firestore.FieldValue.serverTimestamp(),
      endDate: null,
      autoRenew: false
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActiveAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('users').doc('admin-user-001').set(adminUserData);
  console.log('✅ Created admin user');
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Seed in order due to dependencies
    const companyIds = await seedCompanies();
    const playlistIds = await seedPlaylists();
    await seedVideos();
    await seedMockTests(companyIds);
    await seedRoadmaps(companyIds, playlistIds);
    await createAdminUser();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSeeded data:');
    console.log(`- ${companies.length} companies`);
    console.log(`- ${playlists.length} playlists`);
    console.log(`- ${playlists.reduce((sum, p) => sum + p.videos.length, 0)} videos`);
    console.log(`- ${mockTests.length} mock tests`);
    console.log(`- ${roadmaps.length} roadmaps`);
    console.log('- 1 admin user');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedCompanies,
  seedPlaylists,
  seedVideos,
  seedMockTests,
  seedRoadmaps,
  createAdminUser
};
