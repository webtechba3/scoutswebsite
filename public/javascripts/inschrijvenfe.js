let buttonsubmit = document.getElementById('submit');
let inputs = document.querySelectorAll('input');
let toastContainer = document.getElementById('toast-container');

buttonsubmit.addEventListener('click', () => { // lambda-functie
 
    //event.preventDefault(); // Voorkomt standaard form-submit

        $.ajax({
            url: '/verzendSignUpForm',
            type: 'POST',
            data: $(this).serialize(), // Verzamelt alle form-data
            success: function(result) {
                // Verwerkt de JSON-response van de server
                
                console.log(result);
                // Leegmaken van de formulier-velden
              
                
            },
            error: function(err) {
        
                console.error(err);
            }});
            
});

