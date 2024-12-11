document.addEventListener('DOMContentLoaded', () => {
  // Selecteer alle formulieren en voeg een submit-handler toe
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Voorkom standaard formulieractie

      // Haal de gegevens uit het formulier
      const formData = new FormData(e.target);
      const body = {};
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }

      try {
        // Verstuur het formulier via fetch
        const response = await fetch(e.target.action, {
          method: e.target.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        // Toon de melding
        if (response.ok) {
          alert(result.message || 'Actie voltooid');
        } else {
          alert(result.message || 'Er is iets misgegaan.');
        }
      } catch (error) {
        console.error('Fout bij het versturen van het formulier:', error);
        alert('Er is een fout opgetreden. Probeer het opnieuw.');
      }
    });
  });
});
