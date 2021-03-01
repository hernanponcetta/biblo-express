const closeButton = document.getElementById("close-top-menu");
const navItem = document.getElementById("nav-item-container");
const faBars = document.getElementById("fa-bars");
const faTimes = document.getElementById("fa-times");

closeButton.addEventListener("click", (e) => {
  navItem.classList.toggle("hidden");
  faBars.classList.toggle("hidden");
  faTimes.classList.toggle("hidden");
});
