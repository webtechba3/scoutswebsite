document.addEventListener("DOMContentLoaded", function() {
  const navbar = document.querySelector("header");

  // Voeg klasse 'scrolled' toe aan navigatie bij scrollen
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Animatie voor fade-in en slide-in bij scrollen
  const options = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Selecteer alle elementen met .fade-in en .slide-in klassen
  document.querySelectorAll(".fade-in, .slide-in").forEach(el => {
    observer.observe(el);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const dropdownTakken = document.querySelector('[data-dropdown="takken-dropdown"]');

  if (!menuBtn || !navLinks) {
    console.error("menu-btn of nav-links niet gevonden");
    return;
  }

  // Toggle navigatie dropdown bij klik op hamburger
  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Voorkom dat andere click-events worden geactiveerd
    navLinks.classList.toggle("mobile-nav");
    menuBtn.classList.toggle("open");
    // Verberg de Takken-dropdown wanneer de hamburger wordt geopend
    if (window.innerWidth <= 918 && dropdownTakken) {
      dropdownTakken.style.display = navLinks.classList.contains("mobile-nav") ? "none" : "";
    }
  });

  // Sluit de dropdown als je ergens anders klikt
  document.addEventListener("click", (event) => {
    if (!menuBtn.contains(event.target) && !navLinks.contains(event.target)) {
      // Sluit alleen als er buiten de menu-btn en nav-links wordt geklikt
      navLinks.classList.remove("mobile-nav");
      menuBtn.classList.remove("open");
       // Herstel de Takken-dropdown bij sluiten
       if (dropdownTakken) {
        dropdownTakken.style.display = "";
      }
    }
  });

  // Reset de navigatie bij het vergroten van het scherm
  window.addEventListener("resize", () => {
    if (window.innerWidth > 918) {
      navLinks.classList.remove("mobile-nav"); // Verberg de mobiele klasse
      menuBtn.classList.remove("open"); // Reset hamburger-icoon
    }
  });
});



