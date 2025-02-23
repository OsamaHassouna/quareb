document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.qrb-slider__items'); 
    const sliderItems = Array.from(document.querySelectorAll('.qrb-slider__item'));
    const btnNext = document.querySelector('.btn-next');
    const btnPrev = document.querySelector('.btn-prev');
    const htmlDir = document.documentElement.getAttribute('dir');

    let visibleItems = getVisibleItems();
    let currentIndex = visibleItems; // Offset to prevent jump
    let autoPlayInterval;
    let autoPlaySeconds = 3;

    // Clone first few items and append them at the end for seamless transition
    sliderItems.slice(0, visibleItems).forEach((item) => {
        let clone = item.cloneNode(true);

        // Fix: Preserve the "img-founder" class if it exists in the original item
        if (item.querySelector('.img-founder')) {
            clone.querySelector('.item-img').classList.add('img-founder');
        }

        sliderWrapper.appendChild(clone);
    });

    function getVisibleItems() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 800.98) return 1; // Mobile: 1 item visible
        if (screenWidth < 1199.98) return 2; // Tablet: 2 items visible
        return 3; // Default: 3 items visible (desktop)
    }

    function updateButtons() {
        btnPrev.classList.toggle('disabled', currentIndex === visibleItems);
        btnNext.classList.toggle('disabled', currentIndex === sliderItems.length);
        // btnNext.classList.remove('disabled'); // Fix: Next button is always enabled
        // console.log(currentIndex, sliderItems.length);
        
    }

    function slideTo(index, smooth = true) {
        const itemWidth = sliderItems[0].offsetWidth + 30; // Add spacing
        const directionMultiplier = htmlDir === 'rtl' ? 1 : -1;
        sliderWrapper.style.transition = smooth ? "transform 0.3s ease-in-out" : "none";
        sliderWrapper.style.transform = `translateX(${directionMultiplier * index * itemWidth}px)`;
        currentIndex = index;
        updateButtons();
    }

    btnNext.addEventListener('click', function () {
        slideTo(currentIndex + 1);
        restartAutoPlay();
        // if (currentIndex < sliderItems.length - visibleItems) {
        // }
    });

    btnPrev.addEventListener('click', function () {
        if (currentIndex > visibleItems) {
            slideTo(currentIndex - 1);
            restartAutoPlay();
        }
    });

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!document.hidden) {  // Prevent auto-play when tab is inactive
                if (currentIndex < sliderItems.length) {
                    slideTo(currentIndex + 1);
                } else {
                    slideTo(visibleItems, false); // Instantly reset position for seamless looping
                    setTimeout(() => slideTo(visibleItems + 1), 50); // Delay for smooth transition
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
        slideTo(visibleItems, false); // Reset slider position
    }

    window.addEventListener("resize", handleResize);

    sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
    sliderWrapper.addEventListener('mouseleave', startAutoPlay);

    slideTo(visibleItems, false); // Set initial position
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