const REGEX = {
    
    LOGIN: /^[a-zA-Z][a-zA-Z0-9]{2,}$/,
    
    PASSWORD: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/
};


const loginForm = document.getElementById('login-form') as HTMLFormElement;
const loginInput = document.getElementById('login-user') as HTMLInputElement;
const passInput = document.getElementById('login-pass') as HTMLInputElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;


const validateInput = (input: HTMLInputElement, errorId: string, regex: RegExp, errorMsg: string): boolean => {
    const errorSpan = document.getElementById(errorId) as HTMLElement;
    const isValid = regex.test(input.value);

    if (!isValid) {
        input.classList.add('invalid');
        errorSpan.textContent = errorMsg;
    } else {
        input.classList.remove('invalid');
        errorSpan.textContent = '';
    }
    
    toggleSubmitButton();
    return isValid;
};


const toggleSubmitButton = (): void => {
    const isLoginValid = REGEX.LOGIN.test(loginInput.value);
    const isPassValid = REGEX.PASSWORD.test(passInput.value);
    
    
    loginBtn.disabled = !(isLoginValid && isPassValid);
};



loginInput.addEventListener('blur', () => {
    validateInput(loginInput, 'login-error', REGEX.LOGIN, 'Min 3 chars, start with letter');
});

loginInput.addEventListener('focus', () => {
    loginInput.classList.remove('invalid');
    (document.getElementById('login-error') as HTMLElement).textContent = '';
});


passInput.addEventListener('blur', () => {
    validateInput(passInput, 'pass-error', REGEX.PASSWORD, 'Min 6 chars + 1 special char (!@#$%^&*)');
});

passInput.addEventListener('focus', () => {
    passInput.classList.remove('invalid');
    (document.getElementById('pass-error') as HTMLElement).textContent = '';
});


loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    console.log("Attempting to sign in...");
    
    
});