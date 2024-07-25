import {Slider} from './slider.js';

// Slider
const sliderContainers = [...document.querySelectorAll('.js-slider-container')];

sliderContainers.forEach(container => {
    const slider = new Slider(container);
});

// Running line
const runningLineContainers = document.querySelectorAll('.js-running-line');
runningLineContainers.forEach(container => prepareRunningLine(container));

function prepareRunningLine(container) {
    const texts = [...container.children];
    texts.forEach(text => {
        container.appendChild(text.cloneNode(true));
    });
}

// About section
const aboutTop = document.querySelector('.js-about-top');
const aboutTopImage = document.querySelector('.js-about-top-image');
const isMobile = window.innerWidth <= 800;
if (isMobile) {
    aboutTop.querySelector('p').insertAdjacentElement('afterend', aboutTopImage);
}

// Intersection observer
const targets = [...document.querySelectorAll('.js-intersection')];
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('_animated');
        }
    });
}, { threshold: .3 });
targets.forEach(target => observer.observe(target));

// Anchors
const anchors = document.querySelectorAll('.js-anchor');
anchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(`#${anchor.getAttribute('href').slice(1)}`);
        if (target) {
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 20,
                behavior: 'smooth',
            })
        }
    })
})