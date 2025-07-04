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

const moodResourcesData = [
  {
    mood: "Sad",
    resources: {
      youtube: [
        { title: "Motivational Video 1", url: "https://www.youtube.com/watch?v=video1" },
        { title: "Motivational Video 2", url: "https://www.youtube.com/watch?v=video2" }
      ],
      apps: [
        { name: "Calm", url: "https://www.appstore.com/calm" },
        { name: "Headspace", url: "https://www.appstore.com/headspace" }
      ],
      quotes: [
        "\"The best way to predict the future is to create it.\" - Abraham Lincoln",
        "\"You are braver than you believe, stronger than you seem, and smarter than you think.\" - A.A. Milne"
      ],
      books: [
        { title: "The Power of Now", author: "Eckhart Tolle" },
        { title: "Atomic Habits", author: "James Clear" }
      ]
    }
  },
  {
    mood: "Happy",
    resources: {
      youtube: [
        { title: "Happy Motivation Video 1", url: "https://www.youtube.com/watch?v=happyvideo1" },
        { title: "Happy Motivation Video 2", url: "https://www.youtube.com/watch?v=happyvideo2" }
      ],
      apps: [
        { name: "Shine", url: "https://www.appstore.com/shine" },
        { name: "Smiling Mind", url: "https://www.appstore.com/smilingmind" }
      ],
      quotes: [
        "\"Happiness is not something ready-made. It comes from your own actions.\" - Dalai Lama",
        "\"Happiness depends upon ourselves.\" - Aristotle"
      ],
      books: [
        { title: "The Happiness Advantage", author: "Shawn Achor" },
        { title: "The Art of Happiness", author: "Dalai Lama" }
      ]
    }
  },
  {
    "mood": "Neutral",
    "resources": {
      "youtube": [
        { "title": "Calm Your Mind Video", "url": "https://www.youtube.com/watch?v=calmvideo" },
        { "title": "Neutral State of Mind Video", "url": "https://www.youtube.com/watch?v=neutralstate" }
      ],
      "apps": [
        { "name": "Breethe", "url": "https://www.appstore.com/breethe" },
        { "name": "Insight Timer", "url": "https://www.appstore.com/insighttimer" }
      ],
      "quotes": [
        "\"Calmness is the cradle of power.\" - Josiah Gilbert Holland",
        "\"It’s not stress that kills us, it is our reaction to it.\" - Hans Selye"
      ],
      "books": [
        { "title": "The Untethered Soul", "author": "Michael A. Singer" },
        { "title": "Wherever You Go, There You Are", "author": "Jon Kabat-Zinn" }
      ]
    }
  },
  {
    "mood": "Anxious",
    "resources": {
      "youtube": [
        { "title": "Anxiety Relief Video 1", "url": "https://www.youtube.com/watch?v=anxietyrelief1" },
        { "title": "How to Handle Anxiety Video", "url": "https://www.youtube.com/watch?v=handleanxiety" }
      ],
      "apps": [
        { "name": "Wysa", "url": "https://www.appstore.com/wysa" },
        { "name": "MindShift", "url": "https://www.appstore.com/mindshift" }
      ],
      "quotes": [
        "\"Nothing diminishes anxiety faster than action.\" - Walter Anderson",
        "\"You don’t have to control your thoughts. You just have to stop letting them control you.\" - Dan Millman"
      ],
      "books": [
        { "title": "The Anxiety and Phobia Workbook", "author": "Edmund J. Bourne" },
        { "title": "The Power of Now", "author": "Eckhart Tolle" }
      ]
    }
  },
  {
    "mood": "Stressed",
    "resources": {
      "youtube": [
        { "title": "Stress Relief Video", "url": "https://www.youtube.com/watch?v=stressrelief" },
        { "title": "How to Manage Stress Video", "url": "https://www.youtube.com/watch?v=managestress" }
      ],
      "apps": [
        { "name": "Calm Harm", "url": "https://www.appstore.com/calmharm" },
        { "name": "Sanvello", "url": "https://www.appstore.com/sanvello" }
      ],
      "quotes": [
        "\"In the middle of difficulty lies opportunity.\" - Albert Einstein",
        "\"It’s not stress that kills us, it is our reaction to it.\" - Hans Selye"
      ],
      "books": [
        { "title": "Burnout: The Secret to Unlocking the Stress Cycle", "author": "Emily Nagoski" },
        { "title": "The Relaxation Response", "author": "Herbert Benson" }
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
