document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
});

const toggleMenu = () => {
    document.querySelector('aside').classList.toggle('toggled');
}