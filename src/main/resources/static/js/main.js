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
