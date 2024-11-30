$(document).on('submit', 'form[action="/verwijderContact"]', function (event) {
    event.preventDefault(); // Voorkom standaard formulierverzending

    const form = $(this);
    const contactId = form.find('input[name="id"]').val();

    $.ajax({
        url: '/verwijderContact',
        type: 'POST',
        data: { id: contactId },
        success: function (response) {
            console.log(response);
            form.closest('tr').remove(); // Verwijder de rij van de tabel
        },
        error: function (err) {
            console.error('Fout bij het verwijderen van contact:', err);
            alert('Er is een fout opgetreden bij het verwijderen van het contact.');
        }
    });
});

buttonsubmit.addEventListener('click', () => { // lambda-functie
    const form = document.getElementById('contactForm');
    $.ajax({
        url: "/contact",
        type: 'POST',
        data: $(form).serialize(), // Verzamelt alle form-data
        success: function(result) {
            console.log(result);
            form.reset(); // Leeg het formulier
        },
        error: function(err) {
            console.error(err);
        }
    });
});

function onSubmit(token) {
    document.getElementById("demo-form").submit();
}
