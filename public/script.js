const guestWrapper = document.querySelector("#guests-wrapper");
const guests = document.querySelectorAll('.guest');
const unbookedGuest = "icons/book-people-white.png";
const bookedGuest = "icons/book-people-black.png";

let guestsClicked = 0;

guestWrapper.addEventListener("mouseleave", () => {
    guests.forEach(guest => {
        if (guest.index > guestsClicked) {
            guest.src = unbookedGuest;
        }
    });
});

guests.forEach((guest, index) => {
    guest.index = index + 1;
    guest.addEventListener("mouseover", guestMouseOverHandler);
    guest.addEventListener("click", guestClickHandler);
});

function guestMouseOverHandler(e) {
    guests.forEach(guest => {
        if (guest.index <= e.target.index) {
            guest.src = bookedGuest;
        } else {
            if (guest.index > guestsClicked) {
                guest.src = unbookedGuest;
            }
        }
    })

}

function guestClickHandler(e) {
    guests.forEach(guest => {
        if (guest.index <= e.target.index) {
            guest.src = bookedGuest;
        } else {
            guest.src = unbookedGuest;
        }
    });
    guestsClicked = e.target.index;
}

const nextSlide = document.querySelector(".next");
const prevSlide = document.querySelector(".prev");
const dots = document.querySelectorAll(".dots");

nextSlide.addEventListener("click", () => plusSlides(1));
prevSlide.addEventListener("click", () => plusSlides(-1));

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => currentSlide(index+1))
})

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

//shrink header

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (scrollY > 100) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
})

//active header

window.addEventListener('scroll', function() {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('nav a');

    sections.forEach(function(section) {
        let top = section.offsetTop - 400;
        let bottom = top + section.offsetHeight;
        const isDown = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (window.scrollY >= top && window.scrollY <= bottom && !isDown) {
            navLinks.forEach(function(link) {
                link.classList.remove('active-link');
            });

            let link = document.querySelector('nav a[href="#' + section.id + '"]');
            link.classList.add('active-link');
        } else if (isDown) {
            navLinks.forEach(function(link) {
                link.classList.remove('active-link');
            });

            let link = document.querySelector('nav a[href="#footer-wrapper"]');
            link.classList.add('active-link');
        }
    });
});