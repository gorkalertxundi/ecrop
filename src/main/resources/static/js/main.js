let currentView = 'index';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
    addSwitchListeners();
});

const toggleMenu = () => {
    document.querySelector('aside').classList.toggle('toggled');
}

const addSwitchListeners = () => {
    document.querySelectorAll('.main-menu .menu-item a.menu-item-wrap').forEach(i => {
        i.addEventListener('click', e => {
            e.preventDefault();
            switchViewport(i.dataset.view);
        });
    });
}

const switchViewport = async view => {
    if (currentView == view) return;
    currentView = view;
    showViewLoading();
    const req = await fetch(`/view/${view}`);
    const res = await req.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(res, 'text/html');
    updateTitle(doc);
    updateUrl(view);
    document.querySelector('#viewport').innerHTML = doc.querySelector('#viewport').innerHTML;
    clearViewLoading();
    clearInjected();
    injectScript(doc);
    injectStyle(doc);
}

const updateUrl = view => {
    const url = new URL(window.location.href);
    url.pathname = `/${view}`;
    window.history.pushState({}, '', url.href);
}

const updateTitle = doc => {
    document.title = `${doc.querySelector('title').innerHTML} - eCrop`;

}

const clearInjected = () => {
    document.querySelectorAll('.injected').forEach(i => i.remove());
    document.querySelectorAll('*[src*="https://maps.googleapis.com"]').forEach(i => i.remove());
    if (window.google) window.google = {};
};

const injectScript = doc => {
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(s => {
        s.classList.add('injected');
        document.querySelector('head').append(s);
    });
};

const injectStyle = doc => {
    doc.querySelectorAll('script').forEach(i => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = i.src;
        script.classList.add('injected');
        document.querySelector('head').append(script);
    });
};

const showViewLoading = () => {
    document.querySelector('.view-loader').classList.remove('hidden');
};

const clearViewLoading = () => {
    document.querySelector('.view-loader').classList.add('hidden');
}

const apiRequest = async (path, method, successCallback, errorCallback, data) => {
    const req = await makeRequest(path, method, data);
    if (req.status == 401) {
        await getRefreshedToken();
        await retryRequest(path, method, data, successCallback, errorCallback);
    }
    apiCallback(req, successCallback, errorCallback);
}

const makeRequest = async (path, method, data) => {
    console.log(`request path: ${API_URL}${path}`);
    const authToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');
    if ((!authToken || !authToken.length) && (!refreshToken || !refreshToken.length)) { logout(); }

    return await fetch(`${API_URL}${path}`, {
        mode: 'cors',
        method: method,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${authToken}`,
        },
        body: data
    });
}

const retryRequest = async (path, method, data, successCallback, errorCallback) => {
    const req = await makeRequest(path, method, data);
    apiCallback(req, successCallback, errorCallback);
}

const apiCallback = async (req, successCallback, errorCallback) => {
    const contentType = req.headers.get('Content-Type');
    if (req.status >= 200 && req.status < 300) {
        if (typeof successCallback === 'function')
            if (contentType && contentType.indexOf('application/json') !== -1)
                successCallback(await req.json());
            else successCallback(await req.text());
    }
    else if (typeof errorCallback === 'function')
        if (contentType && contentType.indexOf('application/json') !== -1)
            errorCallback(await req.json());
        else errorCallback(await req.text());
}

const createAlert = details => {
    const template = document.getElementById("alert-template");
    const alert = template.cloneNode(true);
    alert.classList.add(details.type);
    alert.querySelector("h3").innerHTML = details.title;
    alert.querySelector("p").innerHTML = details.message;
    alert.querySelector("a").addEventListener("click", () => closeAlert(alert));
    alert.id = null;
    alert.classList.remove("hidden");
    document.querySelector("#alerts").appendChild(alert);
    if (details.type == "success") setTimeout(() => closeAlert(alert), 5000);
}

const closeAlert = alert => {
    console.log(alert);
    alert.remove();
}