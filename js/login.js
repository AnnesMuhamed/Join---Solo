document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        const overlay = document.getElementById('overlay');
        const logoContainer = document.getElementById('logo-container');
        const loginPage = document.getElementById('login-page');
        
        
        overlay.style.opacity = 1;

       
        logoContainer.classList.add('move-to-corner');

       
        loginPage.style.display = 'flex';

        
        setTimeout(() => {
            overlay.style.width = '0';
            overlay.style.height = '0';
            overlay.style.overflow = 'hidden';
        }, 500);
    }, 3200);
});
