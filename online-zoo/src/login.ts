import type { User, AuthResponse, ApiError } from './types.js';

const BASE_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

const REGEX = {
    LOGIN: /^[a-zA-Z][a-zA-Z0-9]{2,}$/, 
    PASSWORD: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/ 
};

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const loginInput = document.getElementById('login-user') as HTMLInputElement;
const passInput = document.getElementById('login-pass') as HTMLInputElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;

const validateField = (input: HTMLInputElement, errorId: string, regex: RegExp, errorMsg: string): boolean => {
    const errorSpan = document.getElementById(errorId) as HTMLElement;
    const isValid = regex.test(input.value);

    if (!isValid) {
        input.classList.add('invalid');
        if (errorSpan) errorSpan.textContent = errorMsg;
    } else {
        input.classList.remove('invalid');
        if (errorSpan) errorSpan.textContent = '';
    }
    checkFormValidity();
    return isValid;
};

const checkFormValidity = (): void => {
    const isFormValid = 
        REGEX.LOGIN.test(loginInput.value) && 
        REGEX.PASSWORD.test(passInput.value);
    
    loginBtn.disabled = !isFormValid;
};

[
    { input: loginInput, err: 'login-error', reg: REGEX.LOGIN, msg: 'Invalid login format' },
    { input: passInput, err: 'pass-error', reg: REGEX.PASSWORD, msg: 'Min 6 chars + 1 special char(!@#$%^&*)' }
].forEach(item => {
    item.input.addEventListener('blur', () => validateField(item.input, item.err, item.reg, item.msg));
    item.input.addEventListener('input', () => {
        if (item.input.classList.contains('invalid')) {
            validateField(item.input, item.err, item.reg, item.msg);
        }
        checkFormValidity();
    });
});

// პროფილის წამოღება - აქ დავამატე token პარამეტრი!
const fetchUserProfile = async (token: string): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData: User = await response.json();
            console.log(userData)
            // აი აქ იწერება მონაცემები, რაც გაკლდა
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            console.log('Profile saved!');
        }
    } catch (error) {
        console.error('Profile fetch error:', error);
    }
};

const loginUser = async (): Promise<void> => {
    const loginData = {
        login: loginInput.value,
        password: passInput.value
    };

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const result: any = await response.json();

            const token=result.data.access_token;
            const user=result.data.user;
            

            
            
            // 1. ჯერ ვინახავთ სტატუსს და ტოკენს
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', token );
            localStorage.setItem('userEmail', user.email );
            localStorage.setItem('userName', user.name );

            // 2. ველოდებით (await) პროფილის წამოღებას და ტოკენს პირდაპირ ვაწვდით
            
            
            // 3. მხოლოდ მას შემდეგ გადავდივართ, რაც მონაცემები ლოკალშია
            window.location.href = '../landing/index.html';
        } else {
            const errorData: ApiError = await response.json();
            alert(errorData.message || 'Incorrect login or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
};

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
});