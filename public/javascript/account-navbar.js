// nav bar funcionalidad
window.onscroll = () => {
    var links = document.getElementsByClassName("navlinks");
    document.getElementById("headSection").style.transition = ".2s";

    const underline = document.getElementsByClassName('navlinks');

    if (this.scrollY <= 60) {
        document.getElementById("headSection").style.backgroundColor = "transparent";
        document.getElementById("headSection").style.boxShadow = "none";
    } else {
        document.getElementById("headSection").style.backgroundColor = "white";
        document.getElementById("headSection").style.boxShadow = "0 2px 30px rgb(0 0 0 / 63%)";
    }
};