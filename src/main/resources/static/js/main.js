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
    console.log('body: ', JSON.stringify(data));
    console.log(`request path: ${API_URL}${path}`);
    const  req = await fetch(`${API_URL}${path}`, {
        mode: 'cors',
        method: method,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getCookie('access_token')}`,
        },
        body: data
    });
    console.log('response: ', req);
    if (req.status == 401) {
        refreshToken();
        console.error('refreshed token, falta refetchear');
    }
    if (req.status >= 200 && req.status < 300) {
        if (typeof successCallback === 'function') successCallback(await req.json());
    }
    else if (typeof errorCallback === 'function') errorCallback(await req.json());
}