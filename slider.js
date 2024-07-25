const isMobile = window.innerWidth <= 768;
const slidesToShow = isMobile ? 1 : 3;

export class Slider {
    constructor(container) {
        this.slider = container.querySelector('.js-slider');
        this.slides = [...this.slider.querySelectorAll('.js-slide')] || [];
        this.activeCount = container.querySelector('.js-slider-active-count') || null;
        this.sliderPrevButton = container.querySelector('.js-slider-button-prev');
        this.sliderNextButton = container.querySelector('.js-slider-button-next');
        this.pagination = container.querySelector('.js-slider-pagination');
        this.bullets = [];
        this.totalSlides = this.slides.length;
        this.currentIndex = slidesToShow;
        this.isAutoplay = container.dataset.autoplay === 'true';
        this.isLoop = container.dataset.loop === 'true';
        this.spaceBetween = container.dataset.spaceBetween;
        this.interval = null;

        this.init();
    }

    init() {
        if (this.isLoop) this.prepareSlider();
        if (this.pagination) this.initPagination();
        if (this.isLoop) this.updateSlider();
        if (this.isAutoplay) this.startAutoSlide();
        this.initEventListeners();
    }

    prepareSlider() {
        this.slides.slice(slidesToShow * -1).reverse().forEach(slide => {
            this.slider.prepend(slide.cloneNode(true));
        });
        this.slides.slice(0, slidesToShow).forEach(slide => {
            this.slider.appendChild(slide.cloneNode(true));
        });
    }

    updateSlider() {
        if (this.isLoop) {
            this.slider.style.transform = `translateX(-${(this.currentIndex) * (100 / slidesToShow)}%)`;
        } else {
            this.slider.style.transform = `translateX(calc(-${(this.currentIndex - 1) * (100 / slidesToShow)}% - ${this.spaceBetween * (this.currentIndex - 1)}px)`;
        }

        if (this.activeCount) {
            if (this.currentIndex > this.totalSlides) {
                this.activeCount.textContent = slidesToShow;
            } else if (this.currentIndex < 1) {
                this.activeCount.textContent = this.totalSlides;
            } else {
                this.activeCount.textContent = this.currentIndex;
            }
        }
        if (this.pagination) {
            this.bullets.forEach(bullet => bullet.classList.remove('_active'));
            this.bullets[this.currentIndex - 1].classList.add('_active');
        }
    }

    startAutoSlide() {
        this.interval = setInterval(this.nextGroup, 4000);
    }

    nextGroup = () => {
        this.currentIndex += slidesToShow;
        this.updateSlider();

        if (this.isLoop) {
            if (this.currentIndex > this.totalSlides) {
                setTimeout(() => {
                    this.slider.style.transition = 'none';
                    this.currentIndex = slidesToShow;
                    this.updateSlider();
                    setTimeout(() => {
                        this.slider.style.transition = 'transform 0.5s ease';
                    }, 100);
                }, 500);
            }
        } else {
            this.updateNavigationStatus();
        }
    }

    prevGroup = () => {
        this.currentIndex -= slidesToShow;
        this.updateSlider();

        if (this.isLoop) {
            if (this.currentIndex < slidesToShow) {
                setTimeout(() => {
                    this.slider.style.transition = 'none';
                    this.currentIndex = this.totalSlides;
                    this.updateSlider();
                    setTimeout(() => {
                        this.slider.style.transition = 'transform 0.5s ease';
                    }, 100);
                }, 500);
            }
        } else {
            this.updateNavigationStatus();
        }
    }

    initPagination = () => {
        for (let i = 0; i < this.totalSlides; i++) {
            const el = document.createElement('li');
            if (!i) el.classList.add('_active');
            this.pagination.appendChild(el);
            this.bullets.push(el);
        }
    }

    initEventListeners = () => {
        this.sliderPrevButton.addEventListener('click', () => {
            clearInterval(this.interval);
            this.prevGroup();
        });

        this.sliderNextButton.addEventListener('click', () => {
            clearInterval(this.interval);
            this.nextGroup();
        });
    }

    updateNavigationStatus = () => {
        if (this.currentIndex === this.totalSlides) {
            this.sliderNextButton.classList.add('_disabled');
        } else if (this.currentIndex === 1) {
            this.sliderPrevButton.classList.add('_disabled');
        } else {
            this.sliderNextButton.classList.remove('_disabled');
            this.sliderPrevButton.classList.remove('_disabled');
        }
    }
}