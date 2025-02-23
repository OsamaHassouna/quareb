document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.qrb-slider__items'); 
    const sliderItems = document.querySelectorAll('.qrb-slider__item');
    const btnNext = document.querySelector('.btn-next');
    const btnPrev = document.querySelector('.btn-prev');
    const htmlDir = document.documentElement.getAttribute('dir');

    let visibleItems = getVisibleItems();
    let currentIndex = 0;
    let autoPlayInterval;
    let autoPlaySeconds = 3; 

    function getVisibleItems() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 800.98) return 1; // Mobile: 1 item visible
        if (screenWidth < 1199.98) return 2; // Tablet: 2 items visible
        return 3; // Default: 3 items visible (desktop)
    }

    function updateButtons() {
        btnPrev.classList.toggle('disabled', currentIndex === 0);
        btnNext.classList.toggle('disabled', currentIndex >= sliderItems.length - visibleItems);
    }

    function slideTo(index) {
        const itemWidth = sliderItems[0].offsetWidth + 30; // Add 25px spacing
        const directionMultiplier = htmlDir === 'rtl' ? 1 : -1;
        sliderWrapper.style.transition = "transform 0.3s ease-in-out";
        sliderWrapper.style.transform = `translateX(${directionMultiplier * index * itemWidth}px)`;
        currentIndex = index;
        updateButtons();
    }

    btnNext.addEventListener('click', function () {
        if (currentIndex < sliderItems.length - visibleItems) {
            slideTo(currentIndex + 1);
            restartAutoPlay();
        }
    });

    btnPrev.addEventListener('click', function () {
        if (currentIndex > 0) {
            slideTo(currentIndex - 1);
            restartAutoPlay();
        }
    });

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!document.hidden) {  // Prevents auto-play when the tab is inactive
                if (currentIndex < sliderItems.length - visibleItems) {
                    slideTo(currentIndex + 1);
                } else {
                    slideTo(0);
                }
            }
        }, autoPlaySeconds * 1000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    function handleResize() {
        visibleItems = getVisibleItems(); // Update visible items
        slideTo(0); // Reset slider position
    }

    window.addEventListener("resize", handleResize);

    sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
    sliderWrapper.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
    updateButtons();

});
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});