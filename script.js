const views = ["home", "projects", "experience", "skills", "startup", "contact"];

const titles = {
  home: "Home",
  projects: "Featured Projects",
  experience: "Experience",
  skills: "Skills & Tools",
  startup: "Wafflin’ Around",
  contact: "Contact"
};

const subtitles = {
  home: "Portfolio playlist",
  projects: "Industry FYP + selected builds",
  experience: "Professional tracklist",
  skills: "Data analysis + game dev + NLP",
  startup: "Startup execution",
  contact: "Let’s connect"
};

const viewElements = document.querySelectorAll(".view");
const navItems = document.querySelectorAll("[data-view-link]");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingSub = document.getElementById("nowPlayingSub");
const playTourBtn = document.getElementById("playTourBtn");
const bottomPlayBtn = document.getElementById("bottomPlayBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const tourProgress = document.getElementById("tourProgress");

let activeIndex = 0;
let isTourPlaying = false;
let tourTimer = null;
let progressTimer = null;
let progressValue = 0;

const TOUR_DELAY = 5200;
const PROGRESS_STEP = 100 / (TOUR_DELAY / 100);

function showView(viewName) {
  const nextIndex = views.indexOf(viewName);

  if (nextIndex === -1) return;

  activeIndex = nextIndex;

  viewElements.forEach((view) => {
    view.classList.toggle("active", view.id === viewName);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.viewLink === viewName);
  });

  nowPlayingTitle.textContent = `Now Viewing: ${titles[viewName]}`;
  nowPlayingSub.textContent = subtitles[viewName];

  progressValue = 0;
  updateProgress();
}

function nextView() {
  const nextIndex = (activeIndex + 1) % views.length;
  showView(views[nextIndex]);
}

function previousView() {
  const previousIndex = (activeIndex - 1 + views.length) % views.length;
  showView(views[previousIndex]);
}

function updateProgress() {
  tourProgress.style.width = `${progressValue}%`;
}

function startProgressTimer() {
  clearInterval(progressTimer);

  progressTimer = setInterval(() => {
    if (!isTourPlaying) return;

    progressValue += PROGRESS_STEP;

    if (progressValue > 100) {
      progressValue = 100;
    }

    updateProgress();
  }, 100);
}

function playTour() {
  if (isTourPlaying) return;

  isTourPlaying = true;
  playTourBtn.textContent = "⏸ Pause Portfolio Tour";
  bottomPlayBtn.textContent = "⏸";

  clearInterval(tourTimer);
  startProgressTimer();

  tourTimer = setInterval(() => {
    nextView();
  }, TOUR_DELAY);
}

function pauseTour() {
  isTourPlaying = false;
  playTourBtn.textContent = "▶ Play Portfolio Tour";
  bottomPlayBtn.textContent = "▶";

  clearInterval(tourTimer);
  clearInterval(progressTimer);
}

function toggleTour() {
  if (isTourPlaying) {
    pauseTour();
  } else {
    playTour();
  }
}

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    const viewName = item.dataset.viewLink;

    if (!viewName) return;

    pauseTour();
    showView(viewName);
  });
});

playTourBtn.addEventListener("click", toggleTour);
bottomPlayBtn.addEventListener("click", toggleTour);

nextBtn.addEventListener("click", () => {
  pauseTour();
  nextView();
});

prevBtn.addEventListener("click", () => {
  pauseTour();
  previousView();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    pauseTour();
    nextView();
  }

  if (event.key === "ArrowLeft") {
    pauseTour();
    previousView();
  }

  if (event.code === "Space") {
    event.preventDefault();
    toggleTour();
  }
});

document.querySelectorAll(".skill-icon img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    const fallback = img.nextElementSibling;

    if (fallback) {
      fallback.style.display = "grid";
      fallback.style.placeItems = "center";
    }
  });
});

showView("home");


/* Image fallback handling */
document.querySelectorAll(".profile-photo, .wafflin-photo").forEach((img) => {
  img.addEventListener("error", () => {
    img.classList.add("image-missing");
    const parent = img.parentElement;
    if (parent) {
      parent.classList.add("missing-image");
    }
  });
});
