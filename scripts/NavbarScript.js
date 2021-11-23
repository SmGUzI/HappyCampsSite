const navElement = document.getElementById('navbar');
const fadeElement = document.getElementById('startfade');
console.log(navElement);

function NavScrollEvent(e) {
    if (window.scrollY == 0) NavTop();
    else NavDown();
}

function NavTop() {
    navElement.classList = ["navbartop"];
    if (fadeElement != undefined) fadeElement.style.opacity = 1;
}

function NavDown() {
    navElement.classList = ["navbar"];
    if (fadeElement != undefined) fadeElement.style.opacity = 0.4;
}

document.addEventListener('scroll', NavScrollEvent);