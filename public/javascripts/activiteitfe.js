/*document.addEventListener('DOMContentLoaded', () => {
    const activiteitForm = document.getElementById('activiteitForm');

    if (activiteitForm) {
        activiteitForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Voorkom standaard form submit
            console.log("Formulier verzonden!"); // Controleer of dit wordt gelogd

            $.ajax({
                url: "/activiteiten/postactiviteit",
                type: 'POST',
                data: $(activiteitForm).serialize(), // Verzamelt alle form-data
                success: function(result) {
                    console.log("Resultaat ontvangen:", result); // Debug hier
                    activiteitForm.reset(); // Reset het formulier bij succes
                },
                error: function(err) {
                    console.error("Fout ontvangen:", err);
                }
            });
        });
    }
});
*/
buttonsubmit.addEventListener('click', () => { // lambda-functie

    const form = document.getElementById('activiteitForm');
    /*if (getCookie("cookie_consent")) {*/
    $.ajax({
    url: "/postactiviteit",
    type: 'POST',
    data: $(form).serialize(), // Verzamelt alle form-data
    success: function(result) {
        //console.log(result);
        // Voer hier acties uit bij succes, zoals een melding weergeven
        form.reset(); // Leeg het formulier
    },
    error: function(err) {
        console.error(err);
        // Verwerk hier fouten, bijvoorbeeld door een melding weer te geven
    }
    });
});