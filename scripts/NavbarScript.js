const navElement = document.getElementById('navbar');
console.log(navElement);

function NavScrollEvent(e) {
    if (window.scrollY == 0) NavTop();
    else NavDown();
}

function NavTop() {
    navElement.classList = ["navbartop"];
}

function NavDown() {
    navElement.classList = ["navbar"];
}

document.addEventListener('scroll', NavScrollEvent);