document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-form');
  const searchResultsContainer = document.querySelector('.search-results');
  const addUrlForm = document.querySelector('.add-form');

  // Controleer of er een zoekterm in localStorage staat
  const savedQuery = localStorage.getItem('spotify-search-query');
  if (savedQuery) {
    fetchSearchResults(savedQuery, searchResultsContainer);
  }

  if (!searchResultsContainer) {
    console.error('searchResultsContainer niet gevonden. Controleer of .search-results bestaat in je HTML.');
    return;
  }

  if (searchForm) {
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const queryInput = searchForm.querySelector('input[name="query"]');
      const query = queryInput.value.trim();

      if (!query) {
        searchResultsContainer.innerHTML = '<p>Voer een zoekterm in.</p>';
        return;
      }

      // Sla de zoekterm op in localStorage
      localStorage.setItem('spotify-search-query', query);

      // Haal de zoekresultaten op
      fetchSearchResults(query, searchResultsContainer);
    });
  }

  // Voeg functionaliteit toe voor "Voeg toe via URL"
  if (addUrlForm) {
    addUrlForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Voorkom standaardformuliergedrag

      const formData = new FormData(addUrlForm);
      const trackUri = formData.get('trackUri').trim();

      if (!trackUri) {
        alert('Voer een geldige Spotify-URI of URL in.');
        return;
      }

      try {
        const response = await fetch('/spotify/add-to-playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackUri }),
        });

        const result = await response.json();
        if (result.success) {
          //alert(result.message || 'Nummer toegevoegd!');
          window.location.reload(); // Herlaad de pagina na succesvolle toevoeging
        } else {
          throw new Error(result.message || 'Toevoegen mislukt.');
        }
      } catch (error) {
        console.error('Fout bij toevoegen:', error);
        alert('Er is een fout opgetreden. Probeer het later opnieuw.');
      }
    });
  }

  // Functie voor het ophalen en weergeven van zoekresultaten
  async function fetchSearchResults(query, container) {
    try {
      const response = await fetch('/spotify/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const tracks = await response.json();
        renderSearchResults(tracks, container);
      } else {
        throw new Error('Fout bij het zoeken. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Fout bij het zoeken:', error);
      container.innerHTML = '<p>Er is een fout opgetreden. Probeer het later opnieuw.</p>';
    }
  }

  // Functie voor het weergeven van zoekresultaten
  function renderSearchResults(tracks, container) {
    container.innerHTML = '';
    if (tracks.length > 0) {
      const ul = document.createElement('ul');
      tracks.forEach((track) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${track.name}</strong> door ${track.artists[0].name}
          <button class="add-track" data-uri="${track.uri}">Voeg toe</button>
        `;
        ul.appendChild(li);
      });
      container.appendChild(ul);

      // Functionaliteit toevoegen aan de knoppen in de zoekresultaten
      const addTrackButtons = container.querySelectorAll('.add-track');
      addTrackButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const trackUri = event.target.getAttribute('data-uri');
          try {
            const response = await fetch('/spotify/add-to-playlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ trackUri }),
            });

            const result = await response.json();
            if (result.success) {
              //alert(result.message || 'Nummer toegevoegd!');
              window.location.reload(); // Herlaad de pagina na succesvolle toevoeging
            } else {
              throw new Error(result.message || 'Toevoegen mislukt.');
            }
          } catch (error) {
            console.error('Fout bij toevoegen:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
          }
        });
      });
    } else {
      container.innerHTML = '<p>Geen nummers gevonden.</p>';
    }
  }
});
