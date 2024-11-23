function togglePasswordbol() {
    const passwordField = document.getElementById('password');
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    }
    
    buttonsubmit.addEventListener('click', () => { // lambda-functie

    const form = document.getElementById('inlogForm');
    if (getCookie("cookie_consent")) {
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
    });}
    else {
        alert("Gelieve eerst de cookies te accepteren");    }
        
    });

// Functie om cookies te lezen
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}