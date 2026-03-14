const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("active");
  });
}

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("active");
  });
});

const roomPhotos = {
  elegance: {
    title: "Camera Elegance",
    images: ["e1.jpeg", "e2.jpeg", "e3.jpeg", "e4.jpeg"]
  },
  comfort: {
    title: "Camera Comfort",
    images: ["c1.jpeg", "c2.jpeg", "c3.jpeg", "c4.jpeg", "c5.jpeg", "c6.jpeg", "c7.jpeg", "c8.jpeg", "c9.jpeg", "c10.jpeg"]
  },
  family: {
    title: "Camera Family",
    images: ["f1.jpeg", "f2.jpeg", "f3.jpeg", "f4.jpeg", "f5.jpeg", "f6.jpeg", "f7.jpeg", "f8.jpeg", "f9.jpeg", "f10.jpeg"]
  },
  relax: {
    title: "Zona Relax in Comune",
    images: ["z1.jpeg", "z2.jpeg", "z3.jpeg", "z4.jpeg", "z5.jpeg", "z6.jpeg"]
  }
};

const galleryModal = document.getElementById("gallery-modal");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryClose = document.getElementById("gallery-close");
const galleryTitle = document.getElementById("gallery-title");
const galleryCurrentImage = document.getElementById("gallery-current-image");
const galleryThumbs = document.getElementById("gallery-thumbs");

function openGallery(roomKey) {
  const room = roomPhotos[roomKey];
  if (!room) return;

  galleryTitle.textContent = room.title;
  galleryCurrentImage.src = room.images[0];
  galleryCurrentImage.alt = room.title;
  galleryThumbs.innerHTML = "";

  room.images.forEach((image, index) => {
    const thumb = document.createElement("img");
    thumb.src = image;
    thumb.alt = `${room.title} foto ${index + 1}`;

    if (index === 0) {
      thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
      galleryCurrentImage.src = image;
      document.querySelectorAll(".gallery-thumbs img").forEach(img => img.classList.remove("active"));
      thumb.classList.add("active");
    });

    galleryThumbs.appendChild(thumb);
  });

  galleryModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeGallery() {
  galleryModal.classList.remove("active");
  document.body.style.overflow = "";
}

document.querySelectorAll(".room-card").forEach(card => {
  card.addEventListener("click", () => {
    openGallery(card.getAttribute("data-room"));
  });
});

if (galleryClose) galleryClose.addEventListener("click", closeGallery);
if (galleryOverlay) galleryOverlay.addEventListener("click", closeGallery);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeGallery();
  }
});
