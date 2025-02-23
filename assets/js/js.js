document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.qrb-slider__items'); 
    const sliderItems = Array.from(document.querySelectorAll('.qrb-slider__item'));
    const btnNext = document.querySelector('.btn-next');
    const btnPrev = document.querySelector('.btn-prev');
    const htmlDir = document.documentElement.getAttribute('dir');

    let visibleItems = getVisibleItems();
    let currentIndex = visibleItems; // Offset to prevent jump
    let autoPlayInterval;
    const autoPlaySeconds = 3000; // 3 seconds

    // Clone first few items and append for seamless looping
    sliderItems.slice(0, visibleItems).forEach(item => {
        const clone = item.cloneNode(true);
        const imgFounder = item.querySelector('.img-founder');
        if (imgFounder) clone.querySelector('.item-img').classList.add('img-founder');
        sliderWrapper.appendChild(clone);
    });

    function getVisibleItems() {
        const width = window.innerWidth;
        return width < 801 ? 1 : width < 1200 ? 2 : 3;
    }

    function updateButtons() {
        btnPrev.classList.toggle('disabled', currentIndex === visibleItems);
        btnNext.classList.toggle('disabled', currentIndex === sliderItems.length);
    }

    function slideTo(index, smooth = true) {
        requestAnimationFrame(() => {
            const itemWidth = sliderItems[0].offsetWidth + 30; // Add spacing
            const direction = htmlDir === 'rtl' ? 1 : -1;
            sliderWrapper.style.transition = smooth ? "transform 0.3s ease-in-out" : "none";
            sliderWrapper.style.transform = `translateX(${direction * index * itemWidth}px)`;
            currentIndex = index;
            updateButtons();
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!document.hidden) { // Prevent autoplay when tab is inactive
                if (currentIndex < sliderItems.length) {
                    slideTo(currentIndex + 1);
                } else {
                    slideTo(visibleItems, false); // Instantly reset position
                    setTimeout(() => slideTo(visibleItems + 1), 50);
                }
            }
        }, autoPlaySeconds);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    function handleResize() {
        visibleItems = getVisibleItems();
        slideTo(visibleItems, false);
    }

    // Event Listeners
    btnNext.addEventListener('click', () => { slideTo(currentIndex + 1); restartAutoPlay(); });
    btnPrev.addEventListener('click', () => { if (currentIndex > visibleItems) slideTo(currentIndex - 1); restartAutoPlay(); });

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", () => document.hidden ? stopAutoPlay() : startAutoPlay());

    sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
    sliderWrapper.addEventListener('mouseleave', startAutoPlay);

    // Initialize
    slideTo(visibleItems, false);
    startAutoPlay();
    updateButtons();
});

// Fade-in effect for sections
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";

                    if (!entry.target.classList.contains("qrb-hero")) {
                        entry.target.style.transform = "translateY(0)";
                    }
                });
                observer.unobserve(entry.target); // Stop observing once effect is applied
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        requestAnimationFrame(() => {
            section.style.opacity = "0";
            section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";

            if (!section.classList.contains("qrb-hero")) {
                section.style.transform = "translateY(60px)";
            }

            observer.observe(section);
        });
    });
});
