const closeButton = document.getElementById("close-top-menu");
const navItem = document.getElementById("nav-item-container");
const faBars = document.getElementById("fa-bars");
const faTimes = document.getElementById("fa-times");

const usersButton = document.getElementById("users-button");
const booksButton = document.getElementById("books-button");
const genresButton = document.getElementById("genres-button");
const authorsButton = document.getElementById("authors-button");
const publishersButton = document.getElementById("publishers-button");
const loginButton = document.getElementById("login-button");

const usersContainer = document.getElementById("users-container");
const booksContainer = document.getElementById("books-container");
const genresContainer = document.getElementById("genres-container");
const authorsContainer = document.getElementById("authors-container");
const publishersContainer = document.getElementById("publishers-container");
const loginContainer = document.getElementById("login-container");

closeButton.addEventListener("click", (e) => {
  navItem.classList.toggle("hidden");
  faBars.classList.toggle("hidden");
  faTimes.classList.toggle("hidden");
});

usersButton.addEventListener("click", (e) => {
  usersContainer.classList.toggle("hidden");
});

booksButton.addEventListener("click", (e) => {
  booksContainer.classList.toggle("hidden");
});

genresButton.addEventListener("click", (e) => {
  genresContainer.classList.toggle("hidden");
});

authorsButton.addEventListener("click", (e) => {
  authorsContainer.classList.toggle("hidden");
});

publishersButton.addEventListener("click", (e) => {
  publishersContainer.classList.toggle("hidden");
});

loginButton.addEventListener("click", (e) => {
  loginContainer.classList.toggle("hidden");
});
