let currentView = 'index';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);

    addSwitchListeners();
    const loginLink = document.querySelector('.login-link');
    loginLink.addEventListener('click', e => {
        e.preventDefault();
        switchViewport(loginLink.dataset.view);
    });

    document.querySelector('.logout').addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

    refresh_token();
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
    console.log(view);
    showViewLoading();
    const req = await fetch(`/view/${view}`);
    const res = await req.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(res, 'text/html');
    document.querySelector('#viewport').innerHTML = doc.querySelector('#viewport').innerHTML;
    clearViewLoading();
    clearInjected();
    injectScript(doc);
    injectStyle(doc);
}

const clearInjected = () => {
    document.querySelectorAll('.injected').forEach(i => i.remove());
};

const injectScript = doc => {
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(s => {
        console.log(s);
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

const logout = () => {
    console.error('logout');
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}