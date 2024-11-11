let buttonsubmit = document.getElementById('submit');
let inputs = document.querySelectorAll('input');
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
