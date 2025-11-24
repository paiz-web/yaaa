// toggle class active
const navbarNav = document.querySelector ('.navbar-nav');
// ketika menu diklik  
document.querySelector ('#hamburger-menu  ') .onclick=() => {
    navbarNav.classList.toggle('active');
};
//klik diluar sidebar untuk menghilangkan nav
const menu  =document.querySelector ('#hamburger-menu');

document.addEventListener('click', function(e){
    if(!menu.contains(e.target)&& !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
})
