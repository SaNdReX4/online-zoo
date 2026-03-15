const emailInputelement = document.querySelector("#email")
const nameInputelement = document.querySelector("#fullName")

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




// პოპ უპ

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modalOverlay');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    
    // პოპაპის გახსნა/დახურვა
    openBtn.onclick = () => overlay.classList.add('active');
    closeBtn.onclick = () => overlay.classList.remove('active');
    window.onclick = (e) => { if(e.target == overlay) overlay.classList.remove('active'); }
    const localemail=localStorage.getItem('userEmail');
    emailInputelement.value=localemail

    const localname=localStorage.getItem('userName');
    nameInputelement.value=localname

    // ნაბიჯების გადართვა
    const showStep = (stepNumber) => {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');
    };

    document.getElementById('next1').onclick = () => showStep(2);
    document.getElementById('next2').onclick = () => showStep(3);
    document.getElementById('backTo1').onclick = () => showStep(1);
    document.getElementById('backTo2').onclick = () => showStep(2);

    // თანხის არჩევა
    const amtBtns = document.querySelectorAll('.amt');
    amtBtns.forEach(btn => {
        btn.onclick = () => {
            amtBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('otherAmountInput').value = '';
        }
    });

    // დასრულება
    document.getElementById('complete').onclick = () => {
        alert("Thanks for the donation!");
        overlay.classList.remove('active');
        showStep(1); // დავაბრუნოთ პირველ ნაბიჯზე შემდეგი გახსნისთვის
    };
});




// promo pop up 


// პრომო პოპაპის ელემენტები
// 1. ცვლადების განსაზღვრა
// 1. ცვლადების განსაზღვრა
const promoPopup = document.getElementById('promoPopup');
const promoClose = document.getElementById('promoCloseBtn');

// ვიყენებთ querySelectorAll-ს, რომ ყველა ღილაკი "დავიჭიროთ" კლასით
const promoButtons = document.querySelectorAll('.promo-trigger-btn'); 

// 2. გახსნა ყველა ღილაკზე, რომელსაც აქვს კლასი .promo-trigger-btn
promoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // გვერდის გადატვირთვის პრევენცია
        if (promoPopup) {
            promoPopup.classList.add('show');
        }
    });
});

// 3. დახურვა X-ზე დაჭერით
if (promoClose) {
    promoClose.onclick = () => {
        promoPopup.classList.remove('show');
    };
}

// 4. დახურვა ფონზე (გვერდზე) დაჭერით
window.addEventListener('click', (e) => {
    if (e.target === promoPopup) {
        promoPopup.classList.remove('show');
    }
});

// 5. თანხის ღილაკებზე დაჭერისას პოპაპის დახურვა
const promoActionBtns = document.querySelectorAll('.promo-amt-btn, .promo-other-btn');
promoActionBtns.forEach(btn => {
    btn.onclick = () => {
        if (promoPopup) {
            promoPopup.classList.remove('show');
        }
        // სურვილის შემთხვევაში აქ შეგიძლია გახსნა მეორე დონაციის პოპაპი:
        // const mainModal = document.getElementById('modalOverlay');
        // if(mainModal) mainModal.classList.add('active');
    };
});