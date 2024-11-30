// Hover-functionaliteit voor het wachtwoord
document.addEventListener("DOMContentLoaded", () => {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.querySelector('.fa-eye');
  
    // Controleer of het wachtwoordveld en oogicoon aanwezig zijn
    if (passwordField && eyeIcon) {
      // Voeg hover-eventlisteners toe aan het oogicoon
      eyeIcon.addEventListener('mouseenter', () => {
        passwordField.type = 'text'; // Toon wachtwoord bij hover
      });
  
      eyeIcon.addEventListener('mouseleave', () => {
        passwordField.type = 'password'; // Verberg wachtwoord bij hover
      });
    } else {
      console.error("Wachtwoordveld of oogicoon niet gevonden!");
    }
  });
  /*
  // Functie om het wachtwoord te toggelen (indien nodig)
  function togglePasswordbol() {
    const passwordField = document.getElementById('password');
    if (passwordField) {
      passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    } else {
      console.error("Wachtwoordveld niet gevonden!");
    }
  }
  */
  // Verzend het formulier via AJAX
  buttonsubmit.addEventListener('click', () => { // lambda-functie

    const form = document.getElementById('inlogForm');
    /*if (getCookie("cookie_consent")) {*/
    $.ajax({
    url: "/verzendInlogForm",
    type: 'POST',
    data: $(form).serialize(), // Verzamelt alle form-data
    success: function(result) {
        console.log(result);
        // Voer hier acties uit bij succes, zoals een melding weergeven
        form.reset(); // Leeg het formulier
    },
    error: function(err) {
        console.error(err);
        // Verwerk hier fouten, bijvoorbeeld door een melding weer te geven
    }
    });/*}
    else {
        alert("Gelieve eerst de cookies te accepteren");    }

    });*/
});
  
  // Functie om cookies te lezen
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  