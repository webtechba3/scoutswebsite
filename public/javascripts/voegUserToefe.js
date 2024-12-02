let buttonsubmit = document.getElementById('submit');
let inputs = document.querySelectorAll('input');

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
  
  buttonsubmit.addEventListener('click', (event) => {
    event.preventDefault(); // Voorkom standaard form-submit

    const form = document.getElementById('voegNieuwAccountToe'); // Selecteer het formulier
    const formData = new FormData(form); // Gebruik FormData voor betere verwerking (inclusief file uploads)

    $.ajax({
        url: '/voegUserToe/voegToe', // Zorg ervoor dat de URL correct is
        type: 'POST',
        data: formData, // Gebruik FormData
        processData: false, // Nodig om FormData correct te verwerken
        contentType: false, // Nodig om multipart/form-data correct in te stellen
        success: function (result) {
            console.log('Resultaat:', result);
            alert('Gebruiker succesvol toegevoegd!');
        },
        error: function (err) {
            console.error('Fout bij toevoegen gebruiker:', err);
            alert('Er ging iets mis. Controleer je invoer en probeer opnieuw.');
        },
    });
});

