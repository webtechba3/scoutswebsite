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
