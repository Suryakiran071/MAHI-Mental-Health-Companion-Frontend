import { getFirestore, collection, doc, setDoc } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";

// Initialize Firebase app (use your Firebase configuration)
const firebaseConfig = {
  apiKey: "AIzaSyAkvzbDgkLsVTcNqwEP3RKJw5f7mL6bS3I",
  authDomain: "mahi-82b54.firebaseapp.com",
  projectId: "mahi-82b54",
  storageBucket: "mahi-82b54.firebasestorage.app",
  messagingSenderId: "130470296789",
  appId: "1:130470296789:web:b53f57a0d1fe2e1e08365c",
  measurementId: "G-VN0TYC1Q67"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data for each mood with custom resources
const moodResourcesData = [
  {
    mood: "Depressed",
    resources: {
      videos: [
        { title: "Relaxation Video", url: "https://www.youtube.com/watch?v=relaxation_video" },
        { title: "Mindfulness Meditation", url: "https://www.youtube.com/watch?v=meditation_video" }
      ],
      apps: ["Calm", "Headspace"],
      books: ["The Power of Now", "The Subtle Art of Not Giving a F*ck"],
      quotes: ["'This too shall pass.' - Unknown"],
      journal_prompts: [
        "Prompt 1: What made you feel down today, and how can you address it?",
        "Prompt 2: What small step could you take today to start feeling better?"
      ]
    }
  },
  {
    mood: "Sad",
    resources: {
      videos: [
        { title: "Motivational Video 1", url: "https://www.youtube.com/watch?v=motivational_video_1" },
        { title: "Inspiration Video 2", url: "https://www.youtube.com/watch?v=inspiration_video_2" }
      ],
      apps: ["Gratitude Journal", "Moodfit"],
      books: ["Atomic Habits", "The 7 Habits of Highly Effective People"],
      quotes: ["'The only way to do great work is to love what you do.' - Steve Jobs"],
      journal_prompts: [
        "Prompt 1: What aspects of your life are you grateful for, even on tough days?",
        "Prompt 2: What positive thoughts or actions can you focus on today to improve your mood?"
      ]
    }
  },
  {
    mood: "Neutral",
    resources: {
      videos: [
        { title: "Productivity Video", url: "https://www.youtube.com/watch?v=productivity_video" },
        { title: "Positive Thinking Tips", url: "https://www.youtube.com/watch?v=positive_thinking_video" }
      ],
      apps: ["Forest", "Focus Booster"],
      books: ["The Power of Habit", "The Four Agreements"],
      quotes: ["'Success is not final, failure is not fatal: It is the courage to continue that counts.' - Winston Churchill"],
      journal_prompts: [
        "Prompt 1: What good things happened today that made you feel grateful?",
        "Prompt 2: How can you share your happiness with someone else today?"
      ]
    }
  },
  {
    mood: "Happy",
    resources: {
      videos: [
        { title: "Happiness Hacks Video", url: "https://www.youtube.com/watch?v=happiness_hacks_video" },
        { title: "Positive Thinking Video", url: "https://www.youtube.com/watch?v=positive_thinking_video_2" }
      ],
      apps: ["Gratitude Journal", "Happify"],
      books: ["The Happiness Advantage", "The Alchemist"],
      quotes: ["'Happiness depends upon ourselves.' - Aristotle"],
      journal_prompts: [
        "Prompt 1: What good things happened today that made you feel grateful?",
        "Prompt 2: How can you share your happiness with someone else today?"
      ]
    }
  },
  {
    mood: "Excited",
    resources: {
      videos: [
        { title: "Success Story Video", url: "https://www.youtube.com/watch?v=success_story_video" },
        { title: "Gratitude Practice Video", url: "https://www.youtube.com/watch?v=gratitude_practice_video" }
      ],
      apps: ["Grateful", "Happify"],
      books: ["You Are a Badass", "The Secret"],
      quotes: ["'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.' - Ralph Waldo Emerson"],
      journal_prompts: [
        "Prompt 1: What are you most proud of today, and why?",
        "Prompt 2: How can you use your happiness to inspire or help others?"
      ]
    }
  },
  {
    mood: "Stressed",
    resources: {
      videos: [
        { title: "Stress Relief Techniques", url: "https://www.youtube.com/watch?v=stress_relief_video" },
        { title: "Breathing Exercises for Relaxation", url: "https://www.youtube.com/watch?v=breathing_exercises" }
      ],
      apps: ["Calm", "Breethe"],
      books: ["The Relaxation and Stress Reduction Workbook", "How to Stop Worrying and Start Living"],
      quotes: ["'Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight.' - Benjamin Franklin"],
      journal_prompts: [
        "Prompt 1: What is causing you stress, and how can you reduce or manage it?",
        "Prompt 2: What relaxation technique or activity can you try today?"
      ]
    }
  },
  {
    mood: "Anxious",
    resources: {
      videos: [
        { title: "Anxiety Reduction Techniques", url: "https://www.youtube.com/watch?v=anxiety_reduction_video" },
        { title: "Mindfulness for Anxiety", url: "https://www.youtube.com/watch?v=mindfulness_for_anxiety" }
      ],
      apps: ["Sanvello", "MyLife"],
      books: ["The Anxiety and Phobia Workbook", "Feel the Fear and Do It Anyway"],
      quotes: ["'Do one thing every day that scares you.' - Eleanor Roosevelt"],
      journal_prompts: [
        "Prompt 1: What are your biggest sources of anxiety, and how can you face them?",
        "Prompt 2: What small action can you take today to ease your anxiety?"
      ]
    }
  },
  {
    mood: "Lonely",
    resources: {
      videos: [
        { title: "Overcoming Loneliness", url: "https://www.youtube.com/watch?v=overcoming_loneliness" },
        { title: "Building Connections", url: "https://www.youtube.com/watch?v=building_connections" }
      ],
      apps: ["Meetup", "Bumble BFF"],
      books: ["Braving the Wilderness", "The Lonely City"],
      quotes: ["'Loneliness and the feeling of being unwanted is the most terrible poverty.' - Mother Teresa"],
      journal_prompts: [
        "Prompt 1: When do you feel most alone, and how can you change that?",
        "Prompt 2: How can you make a meaningful connection today?"
      ]
    }
  },
  {
    mood: "Grateful",
    resources: {
      videos: [
        { title: "Gratitude Practice", url: "https://www.youtube.com/watch?v=gratitude_practice" },
        { title: "Mindfulness Meditation", url: "https://www.youtube.com/watch?v=mindfulness_gratitude" }
      ],
      apps: ["Gratitude Journal", "Five Minute Journal"],
      books: ["The Gratitude Diaries", "Thanks! How the New Science of Gratitude Can Make You Happier"],
      quotes: ["'Gratitude turns what we have into enough.' - Melody Beattie"],
      journal_prompts: [
        "Prompt 1: What are three things you're grateful for today?",
        "Prompt 2: How can you express your gratitude to someone today?"
      ]
    }
  },
  {
    mood: "Motivated",
    resources: {
      videos: [
        { title: "Motivational Speech", url: "https://www.youtube.com/watch?v=motivational_speech" },
        { title: "Overcoming Obstacles", url: "https://www.youtube.com/watch?v=overcoming_obstacles" }
      ],
      apps: ["Todoist", "Notion", "Trello"],
      books: ["Grit", "Start with Why"],
      quotes: ["'The best way to predict the future is to create it.' - Abraham Lincoln"],
      journal_prompts: [
        "Prompt 1: What goals are you working towards, and why are they important to you?",
        "Prompt 2: How can you stay focused and motivated today?"
      ]
    }
  },
  {
    mood: "Frustrated",
    resources: {
      videos: [
        { title: "Frustration Management", url: "https://www.youtube.com/watch?v=frustration_management" },
        { title: "Overcoming Challenges", url: "https://www.youtube.com/watch?v=overcoming_challenges" }
      ],
      apps: ["Calm", "Breethe"],
      books: ["Emotional Agility", "The Gifts of Imperfection"],
      quotes: ["'Don't let yesterday take up too much of today.' - Will Rogers"],
      journal_prompts: [
        "Prompt 1: What aspect of the situation is frustrating you, and what can you control?",
        "Prompt 2: How can you reframe the situation to see it from a positive perspective?"
      ]
    }
  },
  {
    mood: "Overwhelmed",
    resources: {
      videos: [
        { title: "How to Deal with Overwhelm", url: "https://www.youtube.com/watch?v=deal_with_overwhelm" },
        { title: "Mindfulness for Stress Relief", url: "https://www.youtube.com/watch?v=mindfulness_stress_relief" }
      ],
      apps: ["Forest", "Focus Booster"],
      books: ["Getting Things Done", "The Power of Focus"],
      quotes: ["'The best way out is always through.' - Robert Frost"],
      journal_prompts: [
        "Prompt 1: What is the biggest cause of your overwhelm, and how can you break it down into manageable steps?",
        "Prompt 2: What can you do today to regain control of the situation?"
      ]
    }
  },
  {
    mood: "Hopeful",
    resources: {
      videos: [
        { title: "Hopeful Story", url: "https://www.youtube.com/watch?v=hopeful_story" },
        { title: "Positive Thinking", url: "https://www.youtube.com/watch?v=positive_thinking_hopeful" }
      ],
      apps: ["Happify", "Gratitude Journal"],
      books: ["The Hope Circuit", "Man's Search for Meaning"],
      quotes: ["'Hope is not a strategy. But it is a motivator.' - Unknown"],
      journal_prompts: [
        "Prompt 1: What are you hopeful for in the near future?",
        "Prompt 2: How can you take actionable steps to make your hope a reality?"
      ]
    }
  },
  {
    mood: "Inspired",
    resources: {
      videos: [
        { title: "Inspiration from Within", url: "https://www.youtube.com/watch?v=inspiration_within" },
        { title: "Motivational Journey", url: "https://www.youtube.com/watch?v=motivational_journey" }
      ],
      apps: ["Evernote", "Notion"],
      books: ["The Magic of Thinking Big", "Awaken the Giant Within"],
      quotes: ["'The only limit to our realization of tomorrow is our doubts of today.' - Franklin D. Roosevelt"],
      journal_prompts: [
        "Prompt 1: What is one action you can take today that aligns with your bigger goals?",
        "Prompt 2: How can you inspire others with your journey today?"
      ]
    }
  }
];

// Function to add each mood's data to Firestore
const storeMoodResources = async () => {
  const moodResourcesCollection = collection(db, "mood_resources");

  for (const moodData of moodResourcesData) {
    const moodDocRef = doc(moodResourcesCollection, moodData.mood); // Use the mood as the document ID

    try {
      await setDoc(moodDocRef, {
        mood: moodData.mood,
        resources: moodData.resources
      });
      console.log(`Successfully added resources for mood: ${moodData.mood}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
};

// Call the function to store data
storeMoodResources();
