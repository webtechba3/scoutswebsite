document.addEventListener('DOMContentLoaded', () => {
    // Eventlistener voor de uitlogknop
    const logoutButton = document.getElementById('logoutButton');
    const changePasswordButton = document.getElementById('changePasswordButton');
    const passwordForm = document.querySelector('form[action="/wijzigWachtwoord"]');

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard submit van het formulier

            fetch('/account/logout', { // Zorg ervoor dat de URL correct is
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('Uitgelogd:', response.statusText);
                        // Doorsturen naar de homepage of inlogpagina
                        window.location.href = '/';
                    } else {
                        throw new Error('Uitloggen mislukt');
                    }
                })
                .catch((err) => {
                    console.error('Uitloggen mislukt:', err);
                    alert('Uitloggen mislukt. Probeer het opnieuw.');
                });
        });
    }
    
    buttonsubmit.addEventListener('click', () => { // lambda-functie

        const form = document.getElementById('inlogForm');
        /*if (getCookie("cookie_consent")) {*/
        $.ajax({
        url: "/wijzigwachtwoord",
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
        })/*
    const buttonsubmit = document.querySelector('button[type="submit"]'); 
    buttonsubmit.addEventListener('click', () => { // lambda-functie

        const form = document.getElementById('veranderwachtwoordform');
    
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
        });
        });
    */
    /*
    changePasswordButton.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard submit van het formulier

            const formData = new FormData(passwordForm);


            $.ajax({
                url: "/wijzigWachtwoord",
                type: 'POST',
                data: $(formData).serialize()})
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Fout bij wijzigen wachtwoord');
                    }
                })
                .then((result) => {
                    console.log('Wachtwoord gewijzigd:', result);
                    alert('Wachtwoord succesvol gewijzigd.');
                    passwordForm.reset(); // Leeg het formulier
                })
                .catch((err) => {
                    console.error('Fout bij wijzigen wachtwoord:', err);
                    alert('Er ging iets mis. Controleer je invoer en probeer opnieuw.');
                });
        });*/
    });
