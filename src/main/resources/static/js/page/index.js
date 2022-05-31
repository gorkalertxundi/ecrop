document.addEventListener('DOMContentLoaded', () => {
    const view = document.querySelector('meta[name="view"]');
    if (view != null && view.content != 'index') switchViewport(view.content);
});
