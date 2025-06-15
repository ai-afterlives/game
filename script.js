const imagePaths = [
  "images/eluned_portrait.png",
  "images/ElunedCatrin.png",
  "images/book_cover.png",
  "images/gallery1.png",
  "images/gallery2.png",
  "images/gallery3.png",
  "images/gallery4.png",
  "images/gallery5.png",
  "images/gallery6.jpg",
  "images/Eluned_Gwen.png",
  "images/Stitching_Valleys.png",
  "images/gallery7.png",
  "images/gallery8.jpg",
  "images/gallery9.png",
  "images/Eluned2.png",
  "images/mill2.png",
  "images/mill1.png"
];
const preloadedImages = {};
imagePaths.forEach(path => {
  const img = new Image();
  img.src = path;
  preloadedImages[path] = img;
});
let typing = false;
let typingTimeout = null;

const openingScreen = document.getElementById('opening');
const enterButton = document.getElementById('enter-button');
const gameScreen = document.getElementById('game');
const storyElement = document.getElementById('story');
const choicesElement = document.getElementById('choices');
const storyImage = document.getElementById('story-image');
const typeSound = document.getElementById('type-sound');

let soundEnabled = false;

enterButton.addEventListener('click', () => {
  soundEnabled = true;
  openingScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  preloadImages(() => {
    showScene('start');
  });
});
const story = {
  start: {
    text: "You are the curator at Historic Voices Museum, Wales. You’re tasked with developing the AI Afterlife prototype for Eluned Caradog. Where do you begin?",
    image: "images/eluned_portrait.png",
    choices: [
      { text: "Start with the Catrin Meredith estate materials", next: "catrinEstate" },
      { text: "Negotiate with the Caradog family", next: "caradogFamily" }
    ]
  },
  catrinEstate: {
    text: "The Meredith estate donated extensive archives. But the Caradog family still holds private letters. How do you approach them?",
    image: "images/ElunedCatrin.png",
    choices: [
      { text: "Negotiate joint curation with family", next: "familyDeal" },
      { text: "Proceed without family letters", next: "partialArchive" }
    ]
  },
  caradogFamily: {
    text: "The Caradog family is divided. Some fear exposure of Eluned's private life. What’s your move?",
    image: "images/book_cover.png",
    choices: [
      { text: "Offer full transparency rights", next: "familyDeal" },
      { text: "Appeal to Welsh national heritage", next: "familySplit" }
    ]
  },
  familyDeal: {
    text: "A fragile agreement is reached: full archive access, but strict privacy filters.",
    image: "images/gallery1.png",
    choices: [{ text: "Proceed to AI training", next: "aiTraining" }]
  },
  familySplit: {
    text: "The family remains divided. Some papers are withheld. Your dataset is incomplete.",
    image: "images/gallery2.png",
    choices: [
      { text: "Train AI with public records only", next: "blandAI" },
      { text: "Take risks with partial private letters", next: "hallucinationRisk" }
    ]
  },
  partialArchive: {
    text: "With limited personal material, accuracy risks increase.",
    image: "images/gallery3.png",
    choices: [
      { text: "Use only verified speeches", next: "blandAI" },
      { text: "Risk using incomplete private letters", next: "hallucinationRisk" }
    ]
  },
  aiTraining: {
    text: "AI trained. Results promising but unstable. Some hallucinations include Ada Lovelace debates that never occurred!",
    image: "images/gallery4.png",
    choices: [
      { text: "Add human moderation", next: "moderation" },
      { text: "Go fully autonomous", next: "launch" }
    ]
  },
  hallucinationRisk: {
    text: "AI starts generating false interviews with Laura Ashley and political speeches she never gave.",
    image: "images/gallery5.png",
    choices: [
      { text: "Shut down project entirely", next: "shutdown" },
      { text: "Pause and add real-time fact-check filters", next: "moderation" }
    ]
  },
  moderation: {
    text: "Human moderation filters hallucinations. AI Eluned speaks both Welsh and English and honors complex family privacy boundaries.",
    image: "images/gallery6.jpg",
    choices: [{ text: "Proceed to public launch", next: "launch" }]
  },
  launch: {
    text: "Launch day. Public reception is strong. But soon, a viral clip shows AI Eluned falsely claiming she mentored Gwen John.",
    image: "images/Eluned_Gwen.png",
    choices: [
      { text: "Issue public apology", next: "apologyPath" },
      { text: "Defend the AI as artistic license", next: "defendPath" }
    ]
  },
  apologyPath: {
    text: "The museum apologizes. Debate grows about AI responsibility, truth, and Welsh cultural memory. Family demands stricter oversight.",
    image: "images/Stitching_Valleys.png",
    choices: [{ text: "Pause and rewrite ethical guidelines", next: "museumValues" }]
  },
  defendPath: {
    text: "You defend the AI as 'creative interpretation.' Critics accuse the museum of distorting Welsh history.",
    image: "images/book_cover.png",
    choices: [
      { text: "Reopen internal review", next: "museumValues" },
      { text: "Refuse further changes", next: "boardFiresYou" }
    ]
  },
  museumValues: {
    text: "The board reviews: transparency, historical integrity, inclusion, sustainability, Welsh language, and decolonization.",
    image: "images/gallery7.png",
    choices: [{ text: "Restart AI under stricter ethical code", next: "successfulLaunch" }]
  },
  successfulLaunch: {
    text: "AI Eluned 2.0 launches: ethically balanced, community supervised, fully bilingual and deeply respectful of Welsh identity.",
    image: "images/gallery8.jpg",
    choices: [{ text: "Play Again", next: "start" }]
  },
  blandAI: {
    text: "AI Eluned avoids controversy but lacks nuance. Welsh historians criticize its limited depth.",
    image: "images/gallery9.png",
    choices: [
      { text: "Reopen ethical consultation", next: "museumValues" },
      { text: "Keep bland version live", next: "quietSuccess" }
    ]
  },
  quietSuccess: {
    text: "The safe but dull AI exists for education, but never achieves the impact hoped for.",
    image: "images/Eluned2.png",
    choices: [{ text: "Play Again", next: "start" }]
  },
  shutdown: {
    text: "The board cancels the AI Afterlife project for Eluned entirely. Public disappointment grows.",
    image: "images/mill2.jpg",
    choices: [{ text: "Restart", next: "start" }]
  },
  boardFiresYou: {
    text: "You are dismissed. The failed project sparks global debates on AI memory ethics in museums.",
    image: "images/mill1.jpg",
    choices: [{ text: "Restart", next: "start" }]
  }
};

function typeWriter(text, i = 0) {
  if (i === 0 && soundEnabled) {
    typeSound.currentTime = 0;
    typeSound.play();
    typing = true;
  }
  if (i < text.length) {
    storyElement.textContent += text.charAt(i);
    typingTimeout = setTimeout(() => typeWriter(text, i + 1), 50);
  } else {
    typeSound.pause();
    typing = false;
  }
}
const preloadedImages = {};

function preloadImages(callback) {
  let loaded = 0;
  imagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      preloadedImages[path] = img;
      loaded++;
      if (loaded === imagePaths.length) {
        callback(); // Start game when all images loaded
      }
    };
    img.onerror = () => {
      console.error("Failed to preload: " + path);
      loaded++;
      if (loaded === imagePaths.length) {
        callback();
      }
    };
  });
}

function showScene(sceneKey) {
  if (typing) {
    clearTimeout(typingTimeout);
    typing = false;
    typeSound.pause();
  }

  const scene = story[sceneKey];
  storyElement.textContent = '';
  choicesElement.innerHTML = '';
  // First, set image src:
  storyImage.src = scene.image;

  storyImage.onload = () => {
    typeWriter(scene.text);
  }
  if (storyImage.complete) {
    typeWriter(scene.text);
  }

  scene.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice.text;
    button.onclick = () => {
      soundEnabled = true;
      showScene(choice.next);
    };
    choicesElement.appendChild(button);
  });
}
