import { translations } from './translations.js';
export const initI18n = () => {
    const switcher = document.querySelector('.lang-switcher');
    const dropdown = document.querySelector('.lang-dropdown');
    const options = document.querySelectorAll('.lang-dropdown li');
    const currentFlag = document.getElementById('current-flag');
    const currentText = document.getElementById('current-lang-text');
    // ლოგი, რომ შევამოწმოთ იპოვა თუ არა ელემენტები
    console.log("Switcher found:", !!switcher);
    console.log("Dropdown found:", !!dropdown);
    const updateText = (lang) => {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    };
    // 1. გახსნა/დახურვა
    switcher?.addEventListener('click', (e) => {
        console.log("Switcher clicked!"); // ეს უნდა გამოჩნდეს კონსოლში
        e.stopPropagation();
        dropdown?.classList.toggle('active');
    });
    // 2. გვერდზე დაჭერისას დახურვა
    document.addEventListener('click', () => {
        dropdown?.classList.remove('active');
    });
    // 3. ენის არჩევისას
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); // რომ მშობელმა switcher-მა თავიდან არ გახსნას
            const lang = option.getAttribute('data-i18n-lang');
            if (lang) {
                localStorage.setItem('userLang', lang);
                updateText(lang);
                const newImg = option.querySelector('img')?.src;
                if (newImg && currentFlag)
                    currentFlag.src = newImg;
                if (currentText)
                    currentText.textContent = lang.toUpperCase();
            }
            dropdown?.classList.remove('active');
        });
    });
    const savedLang = localStorage.getItem('userLang') || 'en';
    updateText(savedLang);
    if (savedLang === 'de' && currentFlag) {
        currentFlag.src = "https://flagcdn.com/w20/de.png";
        if (currentText)
            currentText.textContent = "DE";
    }
};
//# sourceMappingURL=i18n.js.map