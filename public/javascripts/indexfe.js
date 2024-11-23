buttonsubmit.addEventListener('click', () => { // lambda-functie

    const form = document.getElementById('contactForm');
    /*if (getCookie("cookie_consent")) {*/
    $.ajax({
    url: "/contact",
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
    });
});