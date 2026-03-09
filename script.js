const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("active");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("active");
  });
});

/* GALLERIA CAMERE */
const roomCards = document.querySelectorAll(".room-card");
const galleryModal = document.getElementById("gallery-modal");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryClose = document.getElementById("gallery-close");
const galleryTitle = document.getElementById("gallery-title");
const galleryCurrentImage = document.getElementById("gallery-current-image");
const galleryThumbs = document.getElementById("gallery-thumbs");

const roomPhotos = {
  elegance: {
    title: "Camera Elegance",
    images: ["1.jpeg", "2.jpeg", "3.jpeg"]
  },
  comfort: {
    title: "Camera Comfort",
    images: ["4.jpeg", "5.jpeg"]
  },
  family: {
    title: "Camera Family",
    images: ["6.jpeg", "7.jpeg"]
  }
};

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
    thumb.alt = room.title + " foto " + (index + 1);

    if (index === 0) {
      thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
      galleryCurrentImage.src = image;
      document.querySelectorAll(".gallery-thumbs img").forEach(img => {
        img.classList.remove("active");
      });
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

roomCards.forEach(card => {
  card.addEventListener("click", () => {
    const roomKey = card.getAttribute("data-room");
    openGallery(roomKey);
  });
});

galleryClose.addEventListener("click", closeGallery);
galleryOverlay.addEventListener("click", closeGallery);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeGallery();
  }
});
