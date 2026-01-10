"use strict";

$(function () {
    const dots = document.querySelectorAll('.dot');
    const sections = [...dots].map(dot =>
        document.getElementById(dot.dataset.target)
    );
    const progressFill = document.querySelector('.progress-fill');

    function setActive(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        const progressPercent = index / (dots.length - 1);
        progressFill.style.height = `${progressPercent * 100}%`;
    }

    // Klick → Scroll
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll → Fortschritt
    window.addEventListener('scroll', () => {
        let activeIndex = 0;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2) {
                activeIndex = index;
            }
        });

        setActive(activeIndex);
    });

    // Initialer Zustand
    setActive(0);
});
