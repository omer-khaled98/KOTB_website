/**
 * Travelo - Travel Website JavaScript
 * Custom scripts for the Travelo website
 */
// ===== Sticky Header with Background Change =====
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const navbar_collapse = document.querySelector(".navbar_collapse");
  const navbarNav = document.getElementById("navbarNav");
  const navMin = document.getElementById("nav-min");
  let lastScrollTop = 0;
  let isScrolling = false;

  // دالة تغيير شكل الهيدر حسب التمرير
  function updateHeaderOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      // عند التمرير أكثر من 50px
      navbarNav.classList.add("sc");
      navMin.classList.add("min-sc");
      navbarNav.classList.remove("transparent");
    } else {
      // في أعلى الصفحة
      navbarNav.classList.remove("sc");
      navMin.classList.remove("min-sc");
      navbarNav.classList.add("transparent");
    }

    lastScrollTop = scrollTop;
    isScrolling = false;
  }

  // استمع لحدث التمرير
  window.addEventListener("scroll", function () {
    if (!isScrolling) {
      requestAnimationFrame(updateHeaderOnScroll);
      isScrolling = true;
    }
  });

  // تفعيل التأثير في البداية
  updateHeaderOnScroll();

  // إغلاق القائمة عند الضغط على رابط (للموبايل)
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // إغلاق القائمة في الموبايل
      if (window.innerWidth < 992) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          hide: true,
        });
      }

      // إزالة active من كل الروابط
      navLinks.forEach((l) => l.classList.remove("active"));
      // إضافة active للرابط المضغوط
      this.classList.add("active");
    });
  });

  // تأثير إضافي: إخفاء/إظهار الهيدر عند التمرير السريع (اختياري)
  let hideHeaderTimeout;

  function handleFastScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // التمرير لأسفل - إخفاء الهيدر
      header.style.transform = "translateY(-100%)";
    } else {
      // التمرير لأعلى - إظهار الهيدر
      header.style.transform = "translateY(0)";
    }

    // إظهار الهيدر مرة أخرى بعد توقف التمرير
    clearTimeout(hideHeaderTimeout);
    hideHeaderTimeout = setTimeout(() => {
      header.style.transform = "translateY(0)";
    }, 1000);

    lastScrollTop = scrollTop;
  }

  // فعّل هذا إذا كنت تريد إخفاء/إظهار الهيدر عند التمرير السريع
  // window.addEventListener("scroll", handleFastScroll);

  // تأثير الـ smooth scrolling للروابط الداخلية
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // مراعاة ارتفاع الهيدر

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // تحسين أداء التمرير
  let ticking = false;

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeaderOnScroll);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
});

// ===== تأثيرات إضافية (اختيارية) =====

// تأثير تغيير لون الخلفية تدريجياً
function createGradualBackgroundChange() {
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const header = document.querySelector(".header");

    if (scrolled > 50) {
      const opacity = Math.min(scrolled / 200, 0.98);
      header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    }
  });
}

// تفعيل التأثير التدريجي (اختياري)
// createGradualBackgroundChange();

// تأثير تكبير/تصغير الشعار
function createLogoScaleEffect() {
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const logo = document.querySelector(".logo");

    if (scrolled > 50) {
      logo.style.transform = "scale(0.9)";
    } else {
      logo.style.transform = "scale(1)";
    }
  });
}

// تفعيل تأثير تكبير/تصغير الشعار (اختياري)
// createLogoScaleEffect();
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables
  let currentDestinationSlide = 0;
  let currentTestimonialSlide = 0;
  const destinationSlides = document.querySelectorAll(
    ".destinations-section .destination-card"
  );
  const testimonialSlides = document.querySelectorAll(".testimonial-item");
  const testimonialDots = document.querySelectorAll(".testimonial-dots .dot");

  // Navigation buttons for destinations
  const destPrevBtn = document.querySelector(".destinations-section .prev-btn");
  const destNextBtn = document.querySelector(".destinations-section .next-btn");

  // Navigation buttons for testimonials
  const testimonialPrevBtn = document.querySelector(
    ".testimonials-section .prev-btn"
  );
  const testimonialNextBtn = document.querySelector(
    ".testimonials-section .next-btn"
  );

  // Initialize destination slider
  if (destPrevBtn && destNextBtn) {
    destPrevBtn.addEventListener("click", function () {
      navigateDestinations("prev");
    });

    destNextBtn.addEventListener("click", function () {
      navigateDestinations("next");
    });
  }

  // Initialize testimonial slider
  if (testimonialPrevBtn && testimonialNextBtn) {
    testimonialPrevBtn.addEventListener("click", function () {
      navigateTestimonials("prev");
    });

    testimonialNextBtn.addEventListener("click", function () {
      navigateTestimonials("next");
    });
  }

  // Initialize testimonial dots
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      setTestimonialSlide(index);
    });
  });

  // Function to navigate destination slides
  function navigateDestinations(direction) {
    // Hide all slides first
    destinationSlides.forEach((slide) => {
      slide.style.opacity = "0.5";
      slide.style.transform = "scale(0.95)";
      slide.style.transition = "all 0.3s ease";
    });

    // Calculate new slide index
    if (direction === "next") {
      currentDestinationSlide =
        (currentDestinationSlide + 1) % destinationSlides.length;
    } else {
      currentDestinationSlide =
        (currentDestinationSlide - 1 + destinationSlides.length) %
        destinationSlides.length;
    }

    // Show current slide with animation
    setTimeout(() => {
      destinationSlides.forEach((slide, index) => {
        if (index === currentDestinationSlide) {
          slide.style.opacity = "1";
          slide.style.transform = "scale(1)";
        }
      });
    }, 300);
  }

  // Function to navigate testimonial slides
  function navigateTestimonials(direction) {
    // Calculate new slide index
    if (direction === "next") {
      currentTestimonialSlide =
        (currentTestimonialSlide + 1) % testimonialSlides.length;
    } else {
      currentTestimonialSlide =
        (currentTestimonialSlide - 1 + testimonialSlides.length) %
        testimonialSlides.length;
    }

    setTestimonialSlide(currentTestimonialSlide);
  }

  // Function to set specific testimonial slide
  function setTestimonialSlide(index) {
    // Update current slide index
    currentTestimonialSlide = index;

    // Update dots
    testimonialDots.forEach((dot, i) => {
      if (i === currentTestimonialSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // Update slides with fade effect
    testimonialSlides.forEach((slide, i) => {
      if (i === currentTestimonialSlide) {
        slide.style.opacity = "0";
        setTimeout(() => {
          slide.style.display = "block";
          setTimeout(() => {
            slide.style.opacity = "1";
          }, 50);
        }, 300);
      } else {
        slide.style.opacity = "0";
        setTimeout(() => {
          slide.style.display = "none";
        }, 300);
      }
    });
  }

  // Scroll animations
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".service-card, .destination-card, .feature-item, .testimonial-item"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight - 100) {
        element.classList.add("fade-in");
      }
    });
  };

  // Add fade-in class for CSS animation
  const style = document.createElement("style");
  style.innerHTML = `
        .fade-in {
            animation: fadeIn 1s ease forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .service-card, .destination-card, .feature-item, .testimonial-item {
            opacity: 0;
        }
    `;
  document.head.appendChild(style);

  // Initialize scroll animations
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Run once on page load

  // Newsletter form validation
  const newsletterForm = document.querySelector(
    ".newsletter-form .input-group"
  );
  const emailInput = document.querySelector(
    '.newsletter-form input[type="email"]'
  );
  const subscribeBtn = document.querySelector(".newsletter-form button");

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email === "") {
        showFormMessage("الرجاء إدخال بريدك الإلكتروني", "error");
      } else if (!emailRegex.test(email)) {
        showFormMessage("الرجاء إدخال بريد إلكتروني صحيح", "error");
      } else {
        showFormMessage("تم الاشتراك بنجاح! شكرًا لك", "success");
        emailInput.value = "";
      }
    });
  }

  // Function to show form messages
  function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement("div");
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.marginTop = "10px";
    messageElement.style.padding = "8px 12px";
    messageElement.style.borderRadius = "4px";
    messageElement.style.fontSize = "14px";

    if (type === "error") {
      messageElement.style.backgroundColor = "#ffebee";
      messageElement.style.color = "#f44336";
    } else {
      messageElement.style.backgroundColor = "#e8f5e9";
      messageElement.style.color = "#4caf50";
    }

    // Add message to DOM
    if (newsletterForm) {
      newsletterForm.parentNode.appendChild(messageElement);

      // Remove message after 3 seconds
      setTimeout(() => {
        messageElement.style.opacity = "0";
        messageElement.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          messageElement.remove();
        }, 500);
      }, 3000);
    }
  }

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Mobile menu toggle
  // const navbarToggler = document.querySelector(".navbar-toggler");
  // const navbarCollapse = document.querySelector(".navbar-collapse");

  // if (navbarToggler && navbarCollapse) {
  //   navbarToggler.addEventListener("click", function () {
  //     if (navbarCollapse.classList.contains("show")) {
  //       navbarCollapse.style.height = navbarCollapse.scrollHeight + "px";
  //       setTimeout(() => {
  //         navbarCollapse.style.height = "0";
  //         setTimeout(() => {
  //           navbarCollapse.classList.remove("show");
  //           navbarCollapse.style.height = "";
  //         }, 300);
  //       }, 10);
  //     } else {
  //       navbarCollapse.classList.add("show");
  //       navbarCollapse.style.height = "0";
  //       setTimeout(() => {
  //         navbarCollapse.style.height = navbarCollapse.scrollHeight + "px";
  //         setTimeout(() => {
  //           navbarCollapse.style.height = "";
  //         }, 300);
  //       }, 10);
  //     }
  //   });
  // }

  // Initialize the page
  function init() {
    // Set initial testimonial slide
    setTestimonialSlide(0);

    // Add active class to first destination
    if (destinationSlides.length > 0) {
      destinationSlides[0].style.opacity = "1";
      destinationSlides[0].style.transform = "scale(1)";
    }

    console.log("Travelo website initialized successfully!");
  }

  // Run initialization
  init();
});
