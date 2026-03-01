// burger menu
const burger = document.getElementById('burger-btn');
const closeBtn = document.getElementById('close-btn');
const nav = document.getElementById('nav-menu');

burger.addEventListener('click', () => {
    nav.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    nav.classList.remove('active');
});


const arrow = document.querySelector(".arrow-left");
const panel = document.querySelector(".live-panel");

arrow.addEventListener("click", function () {
  panel.classList.toggle("collapsed");
});