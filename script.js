const views = ["home", "experience", "projects", "skills", "startup", "contact"];

const titles = {
  home: "Home",
  projects: "Featured Projects",
  experience: "Experience",
  skills: "Skills & Tools",
  startup: "Wafflin’ Around",
  contact: "What’s Been Up"
};

const subtitles = {
  home: "Portfolio Playlist",
  projects: "Project Playlist",
  experience: "Professional Tracklist",
  skills: "Favorites Playlist",
  startup: "Joyous Tracklist",
  contact: "Side Quests Playlist"
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


/* Expandable experience cards */
document.querySelectorAll(".expandable-exp").forEach((card) => {
  card.addEventListener("click", () => {
    const alreadyOpen = card.classList.contains("expanded");

    document.querySelectorAll(".expandable-exp").forEach((otherCard) => {
      otherCard.classList.remove("expanded");
    });

    if (!alreadyOpen) {
      card.classList.add("expanded");
    }
  });
});

/* Experience popup cards */
const expPopupOverlay = document.getElementById("expPopupOverlay");
const expPopupBackdrop = document.getElementById("expPopupBackdrop");
const expPopupCard = document.getElementById("expPopupCard");
const expPopupClose = document.getElementById("expPopupClose");

const expPopupDate = document.getElementById("expPopupDate");
const expPopupTitle = document.getElementById("expPopupTitle");
const expPopupCompany = document.getElementById("expPopupCompany");
const expPopupBody = document.getElementById("expPopupBody");

let lastExperienceCard = null;
let lastExperienceRect = null;
let popupScrollbarTimer = null;

function openExperiencePopup(card) {
  lastExperienceCard = card;
  lastExperienceRect = card.getBoundingClientRect();

  const date = card.querySelector(".exp-date")?.textContent || "";
  const title = card.querySelector(".exp-main h3")?.textContent || "";
  const company = card.querySelector(".exp-main p")?.textContent || "";
  const body = card.querySelector(".exp-details")?.innerHTML || "";

  expPopupDate.textContent = date;
  expPopupTitle.textContent = title;
  expPopupCompany.textContent = company;
  expPopupBody.innerHTML = body;

  clearTimeout(popupScrollbarTimer);

  expPopupOverlay.classList.add("active");
  expPopupCard.classList.remove("content-ready");
  expPopupCard.classList.add("popup-animating");

  expPopupCard.style.top = `${lastExperienceRect.top}px`;
  expPopupCard.style.left = `${lastExperienceRect.left}px`;
  expPopupCard.style.width = `${lastExperienceRect.width}px`;
  expPopupCard.style.height = `${lastExperienceRect.height}px`;
  expPopupCard.style.borderRadius = "26px";

  expPopupCard.classList.add("moving");

  requestAnimationFrame(() => {
    const targetWidth = Math.min(820, window.innerWidth - 44);
    const targetHeight = Math.min(520, window.innerHeight - 70);
    const targetLeft = (window.innerWidth - targetWidth) / 2;
    const targetTop = (window.innerHeight - targetHeight) / 2;

    expPopupCard.style.top = `${targetTop}px`;
    expPopupCard.style.left = `${targetLeft}px`;
    expPopupCard.style.width = `${targetWidth}px`;
    expPopupCard.style.height = `${targetHeight}px`;
    expPopupCard.style.borderRadius = "32px";

    setTimeout(() => {
      expPopupCard.classList.add("content-ready");
        popupScrollbarTimer = setTimeout(() => {
          expPopupCard.classList.remove("popup-animating");
        }, 500);
    }, 380);
  });
}

function closeExperiencePopup() {
  if (!lastExperienceRect) return;

  clearTimeout(popupScrollbarTimer);

  expPopupCard.classList.add("popup-animating");
  expPopupCard.classList.remove("content-ready");

  setTimeout(() => {
    expPopupCard.style.top = `${lastExperienceRect.top}px`;
    expPopupCard.style.left = `${lastExperienceRect.left}px`;
    expPopupCard.style.width = `${lastExperienceRect.width}px`;
    expPopupCard.style.height = `${lastExperienceRect.height}px`;
    expPopupCard.style.borderRadius = "26px";
  }, 80);

  setTimeout(() => {
    expPopupOverlay.classList.remove("active");
    expPopupCard.classList.remove("moving");
    lastExperienceCard = null;
    lastExperienceRect = null;
    popupScrollbarTimer = setTimeout(() => {
      expPopupCard.classList.remove("popup-animating");
    }, 500);
  }, 430);
}

document.querySelectorAll(".exp-card-v2").forEach((card) => {
  card.addEventListener("click", () => {
    openExperiencePopup(card);
  });
});

expPopupClose.addEventListener("click", closeExperiencePopup);
expPopupBackdrop.addEventListener("click", closeExperiencePopup);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeExperiencePopup();
  }
});

/* What's Been Up popup cards */
const upPopupOverlay = document.getElementById("upPopupOverlay");
const upPopupBackdrop = document.getElementById("upPopupBackdrop");
const upPopupCard = document.getElementById("upPopupCard");
const upPopupClose = document.getElementById("upPopupClose");

const upPopupDate = document.getElementById("upPopupDate");
const upPopupTitle = document.getElementById("upPopupTitle");
const upPopupSubtitle = document.getElementById("upPopupSubtitle");
const upPopupBody = document.getElementById("upPopupBody");

let lastUpCard = null;
let lastUpRect = null;
let upPopupScrollbarTimer = null;

function openUpPopup(card) {
  lastUpCard = card;
  lastUpRect = card.getBoundingClientRect();

  upPopupDate.textContent = card.dataset.postDate || "";
  upPopupTitle.textContent = card.dataset.postTitle || "";
  upPopupSubtitle.textContent = card.dataset.postSubtitle || "";
  upPopupBody.textContent = card.dataset.postBody || "";

  clearTimeout(upPopupScrollbarTimer);

  upPopupOverlay.classList.add("active");
  upPopupCard.classList.remove("content-ready");
  upPopupCard.classList.add("popup-animating");

  upPopupCard.style.top = `${lastUpRect.top}px`;
  upPopupCard.style.left = `${lastUpRect.left}px`;
  upPopupCard.style.width = `${lastUpRect.width}px`;
  upPopupCard.style.height = `${lastUpRect.height}px`;
  upPopupCard.style.borderRadius = "28px";

  upPopupCard.classList.add("moving");

  requestAnimationFrame(() => {
    const targetWidth = Math.min(860, window.innerWidth - 44);
    const targetHeight = Math.min(520, window.innerHeight - 70);
    const targetLeft = (window.innerWidth - targetWidth) / 2;
    const targetTop = (window.innerHeight - targetHeight) / 2;

    upPopupCard.style.top = `${targetTop}px`;
    upPopupCard.style.left = `${targetLeft}px`;
    upPopupCard.style.width = `${targetWidth}px`;
    upPopupCard.style.height = `${targetHeight}px`;
    upPopupCard.style.borderRadius = "32px";

    setTimeout(() => {
      upPopupCard.classList.add("content-ready");

      upPopupScrollbarTimer = setTimeout(() => {
        upPopupCard.classList.remove("popup-animating");
      }, 500);
    }, 380);
  });
}

function closeUpPopup() {
  if (!lastUpRect) return;

  clearTimeout(upPopupScrollbarTimer);
  upPopupCard.classList.add("popup-animating");
  upPopupCard.classList.remove("content-ready");

  setTimeout(() => {
    upPopupCard.style.top = `${lastUpRect.top}px`;
    upPopupCard.style.left = `${lastUpRect.left}px`;
    upPopupCard.style.width = `${lastUpRect.width}px`;
    upPopupCard.style.height = `${lastUpRect.height}px`;
    upPopupCard.style.borderRadius = "28px";
  }, 80);

  setTimeout(() => {
    upPopupOverlay.classList.remove("active");
    upPopupCard.classList.remove("moving");

    lastUpCard = null;
    lastUpRect = null;

    upPopupScrollbarTimer = setTimeout(() => {
      upPopupCard.classList.remove("popup-animating");
    }, 500);
  }, 430);
}

document.querySelectorAll(".up-card").forEach((card) => {
  card.addEventListener("click", () => {
    openUpPopup(card);
  });
});

if (upPopupClose) upPopupClose.addEventListener("click", closeUpPopup);
if (upPopupBackdrop) upPopupBackdrop.addEventListener("click", closeUpPopup);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeUpPopup();
  }
});