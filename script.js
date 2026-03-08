const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

menuToggle.addEventListener("click", () => {
  siteNav.classList.toggle("active");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("active");
  });
});
