document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitActiviteit');
    const activiteitForm = document.getElementById('activiteitForm');

    if (submitButton && activiteitForm) {
        submitButton.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard submit van het formulier
            $.ajax({
                url: "/postactiviteit",
                type: 'POST',
                data: $(activiteitForm).serialize(), // Verzamelt alle form-data
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
}});
