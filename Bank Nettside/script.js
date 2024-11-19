'use strict';

//-------------------------------
// Const
//-------------------------------

// Constants - selecting elements
const mainHeader = document.querySelector(`.header`);
const sections = document.querySelectorAll(`.section`);
document.getElementById(`section--1`);
const buttons = document.getElementsByTagName(`button`);
const scrollToButton = document.querySelector(`.btn--scroll-to`);
const firstSection = document.querySelector(`#section--1`);
const modalWindow = document.querySelector('.modal');
const overlayBackground = document.querySelector('.overlay');
const closeModalButton = document.querySelector('.btn--close-modal');
const openModalButtons = document.querySelectorAll('.btn--show-modal');
const navigationBar = document.querySelector(`.nav`);
const tabButtons = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabContents = document.querySelectorAll(`.operations__content`);
const lazyLoadImages = document.querySelectorAll(`img[data-src]`);
const appSections = document.querySelectorAll(`.section`);

//-------------------------------
// Functions
//-------------------------------

// Function to open modal
const showModal = function (event) {
  event.preventDefault();
  modalWindow.classList.remove('hidden');
  overlayBackground.classList.remove('hidden');
};

// Function to close modal
const hideModal = function () {
  modalWindow.classList.add('hidden');
  overlayBackground.classList.add('hidden');
};

// Scroll to a specific section
const scrollToFirstSection = function (event) {
  firstSection.scrollIntoView({ behavior: 'smooth' });
};

// Reveal hidden sections
const displaySection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

// Lazy loading images
const loadLazyImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};

// Sticky navigation
const manageStickyNavigation = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navigationBar.classList.add(`sticky`);
  else navigationBar.classList.remove(`sticky`);
};

// Slider logic
const initSlider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const leftArrow = document.querySelector(`.slider__btn--left`);
  const rightArrow = document.querySelector(`.slider__btn--right`);
  const dotsContainer = document.querySelector(`.dots`);
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Create dots under slides
  const generateDots = function () {
    slides.forEach(function (_, index) {
      dotsContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  // Activate dot corresponding to the current slide
  const highlightActiveDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  // Change slide
  const moveToSlide = function (slide) {
    slides.forEach(
      (slideElement, index) =>
        (slideElement.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  };

  const switchSlide = function (direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    moveToSlide(currentSlide);
    highlightActiveDot(currentSlide);
  };

  // Initialize slider
  const initializeSlider = function () {
    moveToSlide(0);
    generateDots();
    highlightActiveDot(0);
  };
  initializeSlider();

  // Event listeners for slider
  rightArrow.addEventListener('click', () => switchSlide(1));
  leftArrow.addEventListener('click', () => switchSlide(-1));
  dotsContainer.addEventListener(`click`, function (event) {
    if (event.target.classList.contains(`dots__dot`)) {
      const slide = event.target.dataset.slide;
      moveToSlide(slide);
      highlightActiveDot(slide);
    }
  });

  // Keyboard navigation
  document.addEventListener(`keydown`, function (event) {
    if (event.key === `ArrowLeft`) switchSlide(-1);
    if (event.key === `ArrowRight`) switchSlide(1);
  });
};

// Handle hover effect on navigation links
const handleNavHoverEffect = function (event, opacity) {
  if (event.target.classList.contains(`nav__link`)) {
    const link = event.target;
    const siblingLinks = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logoImage = link.closest(`.nav`).querySelector(`img`);
    siblingLinks.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = opacity;
    });
    logoImage.style.opacity = opacity;
  }
};

//-------------------------------
// Event listeners
//-------------------------------

/// Modal event listeners
openModalButtons.forEach(button => button.addEventListener(`click`, showModal));
closeModalButton.addEventListener('click', hideModal);
overlayBackground.addEventListener('click', hideModal);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    hideModal();
  }
});

// Navigation hover effect
navigationBar.addEventListener(`mouseover`, event =>
  handleNavHoverEffect(event, 0.5)
);
navigationBar.addEventListener(`mouseout`, event =>
  handleNavHoverEffect(event, 1)
);

// Page scrolling
scrollToButton.addEventListener(`click`, scrollToFirstSection);

// Event delegation for navigation links
document
  .querySelector(`.nav__links`)
  .addEventListener(`click`, function (event) {
    if (event.target.classList.contains(`nav__link`)) {
      event.preventDefault();
      const targetID = event.target.getAttribute(`href`);
      document.querySelector(targetID).scrollIntoView({ behavior: `smooth` });
    }
  });

// Observers
const sectionObserver = new IntersectionObserver(displaySection, {
  root: null,
  threshold: 0.15,
});
appSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

const imageObserver = new IntersectionObserver(loadLazyImage, {
  root: null,
  threshold: 0.1,
});
lazyLoadImages.forEach(image => imageObserver.observe(image));

const headerObserver = new IntersectionObserver(manageStickyNavigation, {
  root: null,
  threshold: 0,
});
headerObserver.observe(mainHeader);

//-------------------------------
//Initialization
//-------------------------------

// Initialize slider
initSlider();

// Display cookie message
const cookieMessage = document.createElement(`div`);
cookieMessage.classList.add(`cookie-message`);
cookieMessage.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
mainHeader.append(cookieMessage);

// Remove cookie message
document
  .querySelector(`.btn--close-cookie`)
  .addEventListener(`click`, function () {
    cookieMessage.remove();
  });

// Style cookie message
cookieMessage.style.backgroundColor = `#37383d`;
cookieMessage.style.width = `120%`;
cookieMessage.style.height =
  Number.parseFloat(getComputedStyle(cookieMessage).height, 10) + 30 + `px`;
document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// Highlight header
const mainHeading = document.querySelector(`h1`);
mainHeading.firstElementChild.style.color = `darkolivegreen`;
mainHeading.lastElementChild.style.color = `orangered`;
