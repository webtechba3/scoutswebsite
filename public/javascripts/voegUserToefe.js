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
  
buttonsubmit.addEventListener('click', () => { // lambda-functie

    //event.preventDefault(); // Voorkomt standaard form-submit

        $.ajax({
            url: '/voegToe',
            type: 'POST',
            data: $(this).serialize(), // Verzamelt alle form-data
            success: function(result) {
                // Verwerkt de JSON-response van de server
                
                console.log(result);
            },
            error: function(err) {
        
                console.error(err);
            }});
            
});
