const guestWrapper = document.querySelector("#guests-wrapper");
const guests = document.querySelectorAll('.guest');
const unbookedGuest = "icons/book-people-white.png";
const bookedGuest = "icons/book-people-black.png";

let guestsClicked = 0;
let isError = false;

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

function clearGuests() {
    guestsClicked = 0;
    guests.forEach(guest => {
        guest.src = unbookedGuest;
    })
}

const formInputs = document.querySelectorAll(".form__input");
formInputs.forEach(input => {
    input.addEventListener("input", removeError)
})

document.querySelector("#book-form").addEventListener("submit", formSubmitHandler);

function formSubmitHandler(e) {
    e.preventDefault();

    if (!checkForm()) {
        return;
    }

    const book = {};
    book.firstname = document.querySelector("#firstname").value;
    book.lastname = document.querySelector("#lastname").value;
    book.phone = document.querySelector("#phone").value;
    book.date = document.querySelector("#book-date").value;
    book.guests = guestsClicked;

    fetch("http://localhost:3000/submit_book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    }).then(res => {
        if (res.ok) {
            alert("Заказ принят");
        } else {
            alert("Ошибка сервера");
        }
    }).catch(err => {
        console.log(err);
    });
    clearForm();
}

function checkForm() {
    if (document.querySelector("#firstname").value === "") {
        createErrorValidation("firstname");
        return false;
    }
    if (document.querySelector("#lastname").value === "") {
        createErrorValidation("lastname");
        return false;
    }
    if (document.querySelector("#phone").value === "") {
        createErrorValidation("phone");
        return false;
    } else if (!checkPhone(document.querySelector("#phone").value)) {
        createErrorValidation("phoneNum");
        return false;
    }
    if (document.querySelector("#book-date").value === "") {
        createErrorValidation("date");
        return false;
    }
    if (guestsClicked === 0) {
        alert("Выберете количество гостей");
        return false;
    }
    return true;
}

function checkPhone(phone) {
    const phoneReg = /^\+375(29|33|44)\d{7}$/;
    return phoneReg.test(phone);
}

function createErrorValidation(row) {
    if (isError) {
        return;
    }
    let rowName = row;
    const errorElement = document.createElement("p");
    errorElement.classList.add("error");
    if (row === "phoneNum") {
        errorElement.textContent = "Введите корректный номер телефона (+375XXYYYYYYY)";
        rowName = "phone";
    } else {
        errorElement.textContent = "Укажите это поле";
    }
    document.querySelector(`#${rowName}-div`).appendChild(errorElement);
    document.querySelector(`#${rowName}`).classList.add("error-input");
    isError = true;
}

function removeError(e) {
    console.log("remove")
    if (isError) {
        e.target.parentNode.removeChild(document.querySelector(`.error`));
        formInputs.forEach(input => {
            input.classList.remove("error-input");
        })
        isError = false;
    }
}

function clearForm() {
    document.querySelector("#firstname").value = "";
    document.querySelector("#lastname").value = "";
    document.querySelector("#phone").value = "";
    document.querySelector("#book-date").value = "";
    clearGuests();
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

function plusSlides(n) {
    showSlides(slideIndex += n);
}

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
    setTimeout(() => {
        slideIndex = slideIndex === 4 ? 1 : slideIndex+1;
        showSlides(slideIndex);
    }, 3000);
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

window.addEventListener('scroll', () => {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('nav a');
    sections.forEach(section => {
        let top = section.offsetTop - 400;
        let bottom = top + section.offsetHeight;
        const isDown = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (window.scrollY >= top && window.scrollY <= bottom && !isDown) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
            });

            let link = document.querySelector('nav a[href="#' + section.id + '"]');
            link.classList.add('active-link');
        } else if (isDown) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
            });

            let link = document.querySelector('nav a[href="#footer"]');
            link.classList.add('active-link');
        }
    });
});