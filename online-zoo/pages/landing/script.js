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


// cards
const container = document.getElementById('cards-container');
const dots = document.querySelectorAll('.dot');

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        
        const activeDot = document.querySelector('.dot.active');
        if (activeDot) activeDot.classList.remove('active');
        dot.classList.add('active');

        
        const offset = index * 320; 
        container.style.transform = `translateX(-${offset}px)`;
    });
});




const userContainer = document.getElementById('cards-container');
const userDots = document.querySelectorAll('.dot');

userDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        userContainer.style.transform = `translateX(${index * -320}px)`;
        
        userDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
});


const animalContainer = document.getElementById('animal-cards-container');
const animalDots = document.querySelectorAll('.animal-dot'); 

animalDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        
        animalContainer.style.transform = `translateX(${index * -320}px)`;
        
        
        animalDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
});





