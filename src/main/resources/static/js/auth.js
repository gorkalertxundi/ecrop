const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const USER_COOKIE = 'user';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.logout').addEventListener('click', e => {
        e.preventDefault();
        logout();
    });
    checkLoggedIn();
    enableMenuItems();
});

const getCookie = name => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const getRefreshedToken = async () => {
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
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${res.access_token ? res.access_token : ''}; path=/`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=${res.refresh_token ? res.refresh_token : ''}; path=/`;
}

const disableLogin = () => {
    document.querySelector('.profile-button').removeEventListener('click', evtLogin);
    document.querySelector('.profile').classList.add('logged');
    document.querySelector('.login-form').classList.add('hidden');
    document.querySelector('.logout').classList.remove('hidden');
}

const enableLogin = () => {
    document.querySelector('.profile-button').addEventListener('click', evtLogin);
    document.querySelector('.profile').classList.remove('logged');
    document.querySelector('.logout').classList.add('hidden');
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
    window.location.href = '/';
}

const checkLoggedIn = () => {
    const access_token = getCookie(ACCESS_TOKEN_COOKIE);
    if (!access_token) {
        enableLogin();
    } else {
        disableLogin();
        apiRequest('user/me', 'GET', setProfilePicture, null, null);
    }
}

const setProfilePicture = res => {
    const profile = document.querySelector('.profile-icon');
    profile.src = res.imageUrl;
}

const enableMenuItems = () => {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
    if (!accessToken || !accessToken.length) return;

    const userPivileges = parseJwt(accessToken).privileges;

    document.querySelectorAll('.menu-item').forEach(item => {
        if (!item.dataset.privileges) return;
        item.dataset.privileges.split(' ').forEach(privilege => {
            if (userPivileges.includes(privilege)) {
                item.classList.remove('hidden');
            }
        })
    });
}

const parseJwt = token => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};