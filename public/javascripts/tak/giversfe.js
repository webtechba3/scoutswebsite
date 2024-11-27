document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const resultsContainer = document.getElementById('results');
    const playlistContainer = document.getElementById('playlist'); // Container voor de afspeellijst

    console.log('Formulier gevonden:', form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = new FormData(form).get('query');

        try {
            const response = await fetch('/spotify/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();

            resultsContainer.innerHTML = data.tracks.map(track => `
                <li>
                    ${track.name} - ${track.artists[0].name}
                    <button data-uri="${track.uri}" class="add-to-playlist">Toevoegen</button>
                </li>
            `).join('');

            document.querySelectorAll('.add-to-playlist').forEach(button => {
                button.addEventListener('click', async () => {
                    const trackUri = button.getAttribute('data-uri');

                    const addResponse = await fetch('/spotify/add-to-playlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ trackUri }),
                    });

                    if (addResponse.ok) {
                        const addedTrack = data.tracks.find(t => t.uri === trackUri);
                        if (addedTrack) {
                            playlistContainer.innerHTML += `
                                <li>${addedTrack.name} - ${addedTrack.artists[0].name}</li>
                            `;
                        }
                        alert('Nummer toegevoegd aan de afspeellijst!');
                    } else {
                        alert('Toevoegen mislukt. Probeer opnieuw.');
                    }
                });
            });
        } catch (error) {
            console.error('Fout bij zoeken:', error);
        }
    });
});
