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

    if (changePasswordButton && passwordForm) {
        changePasswordButton.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard submit van het formulier

            const formData = new FormData(passwordForm);
            const formDataJSON = Object.fromEntries(formData.entries()); // Converteer FormData naar JSON-object

            fetch('/wijzigWachtwoord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataJSON),
            })
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
        });
    }
});