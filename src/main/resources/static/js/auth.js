const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.logout').addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

    checkLoggedIn();

});

const getCookie = name => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const refreshToken = async () => {
    const refresh_token = getCookie(REFRESH_TOKEN_COOKIE);
    if (!refresh_token) {
        logout();
        return;
    }

    const req = await fetch('http://localhost:8080/auth/refresh', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refresh_token}`,
        }
    });
    const res = await req.json();
    console.log(res);
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${res.access_token}; path=/`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=${res.refresh_token}; path=/`;
}

const disableLogin = () => {
    document.querySelector('.profile-button').removeEventListener('click', evtLogin);
    document.querySelector('.profile').classList.add('logged');
}

const enableLogin = () => {
    document.querySelector('.profile-button').addEventListener('click', evtLogin);
    document.querySelector('.profile').classList.remove('logged');
}

const evtLogin = e => {
    switchViewport(document.querySelector('.profile-button').dataset.view);
}

const logout = () => {
    console.error('logout');
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    enableLogin();
}

const checkLoggedIn = () => {
    const access_token = getCookie(ACCESS_TOKEN_COOKIE);
    if (!access_token) {
        enableLogin();
    } else {
        disableLogin();
    }
}

