document.addEventListener('DOMContentLoaded', () => {
    // Eventlistener voor de uitlogknop
    const logoutButton = document.getElementById('logoutButton');
    const passwordToggles = document.querySelectorAll('.fa-eye');

    // Hover-functionaliteit voor wachtwoordvelden
    passwordToggles.forEach((eyeIcon) => {
        const targetId = eyeIcon.getAttribute('data-target'); // Haal de gekoppelde wachtwoordveld-ID op
        const passwordField = document.getElementById(targetId);

        if (passwordField) {
            eyeIcon.addEventListener('mouseenter', () => {
                passwordField.type = 'text'; // Toon wachtwoord
            });

            eyeIcon.addEventListener('mouseleave', () => {
                passwordField.type = 'password'; // Verberg wachtwoord
            });
        } else {
            console.error(`Wachtwoordveld met ID '${targetId}' niet gevonden!`);
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard submit van het formulier

            fetch('/account/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('Uitgelogd:', response.statusText);
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

    // Eventlistener voor wachtwoord wijzigen
    const passwordForm = document.getElementById('wijzigwachtwoordform');
    const changePasswordButton = document.querySelector('button[type="submit"]');

    if (passwordForm && changePasswordButton) {
        changePasswordButton.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard formulierverzending

            const formData = new FormData(passwordForm);

            fetch('/account/wijzigwachtwoord', {
                method: 'POST',
                body: formData,
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
