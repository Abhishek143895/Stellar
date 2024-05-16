const responsive = {
    0: {
        items: 1
    },
    320: {
        items: 1
    },
    560: {
        items: 2
    },
    960: {
        items: 3
    }
}

$(document).ready(function () {

    // AOS Instance
    AOS.init();

});


// ================== youtube i frame carousel --------------------
let slideIndex = 1;
let autoSlideInterval;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
const carouselInner = document.querySelector('.carousel-inner');
const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;
let isVideoPlaying = false;

// Array to hold references to YouTube players
const players = [];

function onYouTubeIframeAPIReady() {
    // Loop through each iframe and initialize YouTube player
    document.querySelectorAll('iframe').forEach((iframe, index) => {
        const player = new YT.Player(iframe, {
            events: {
                'onStateChange': event => onPlayerStateChange(event, index)
            }
        });
        players.push(player);
    });
}

function onPlayerStateChange(event, index) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            stopAutoSlide();
            isVideoPlaying = true;
            break;
        case YT.PlayerState.PAUSED:
        case YT.PlayerState.ENDED:
            isVideoPlaying = false;
            startAutoSlide();
            break;
    }
}

// Function to update slide based on index
function showSlides(n) {
    if (n > totalSlides) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = totalSlides;
    }

    const offset = -((slideIndex - 1) * 100);
    carouselInner.style.transform = `translateX(${offset}%)`;
    updateDots();
}

// Function to set the position by translateX
function setPositionByIndex() {
    currentTranslate = (slideIndex - 1) * -carouselInner.clientWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
}

// Function to update the active dot
function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
    });
    dots[slideIndex - 1].classList.add('active');
}

// Function to start auto sliding
function startAutoSlide() {
    if (!isVideoPlaying) {
        autoSlideInterval = setInterval(() => {
            slideIndex++;
            showSlides(slideIndex);
        }, 3000);
    }
}

// Function to stop auto sliding
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Add event listeners for swipe functionality
carouselInner.addEventListener('mousedown', startDrag);
carouselInner.addEventListener('touchstart', startDrag);
carouselInner.addEventListener('mousemove', drag);
carouselInner.addEventListener('touchmove', drag);
carouselInner.addEventListener('mouseup', endDrag);
carouselInner.addEventListener('mouseleave', endDrag);
carouselInner.addEventListener('touchend', endDrag);

// Start dragging
function startDrag(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    carouselInner.classList.add('grabbing');
    stopAutoSlide();
}

// Dragging event
function drag(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

// End dragging
function endDrag() {
    if (isDragging) {
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && slideIndex < totalSlides) {
            slideIndex++;
        }

        if (movedBy > 100 && slideIndex > 1) {
            slideIndex--;
        }

        setPositionByIndex();
        carouselInner.classList.remove('grabbing');
        startAutoSlide();
    }
}

// Get the position X of the mouse or touch event
function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

// Set the slider position by transforming translateX
function setSliderPosition() {
    carouselInner.style.transform = `translateX(${currentTranslate}px)`;
}

// Animation for dragging
function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

// Function to go to a specific slide
function currentSlide(n) {
    slideIndex = n;
    setPositionByIndex();
    updateDots();
    stopAutoSlide();
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);
    startAutoSlide();
});
