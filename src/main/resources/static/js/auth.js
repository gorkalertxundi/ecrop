const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

const getCookie = name => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const refresh_token = async () => {
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