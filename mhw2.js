// Seleziona tutti i link di navigazione
const navLinks = document.querySelectorAll('header nav ul li a');

// Aggiunge un gestore di eventi al clic su ciascun link di navigazione
navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Previene il comportamento predefinito del link
    const section = link.getAttribute('data-section'); // Ottiene la sezione corrispondente dall'attributo data-section
    showSection(section); // Mostra la sezione corrispondente
  });
});

// Funzione per mostrare una sezione specifica
function showSection(section) {
  const contentElement = document.getElementById('content');
  contentElement.innerHTML = `<h2>${section.toUpperCase()}</h2><p>Contenuto della sezione ${section}.</p>`;
}

// Seleziona tutti i pulsanti "SCOPRI DI PIÙ"
const scopriDiPiuButtons = document.querySelectorAll('.scopri-di-piu');

// Aggiunge un gestore di eventi al clic su ciascun pulsante "SCOPRI DI PIÙ"
scopriDiPiuButtons.forEach(button => {
  button.addEventListener('click', () => {
    alert('Hai cliccato su "SCOPRI DI PIÙ"!');
  });
});

// Seleziona tutte le scatole delle immagini
const imageBoxes = document.querySelectorAll('.image-box');

// Aggiunge un gestore di eventi al passaggio del mouse su ciascuna scatola delle immagini
imageBoxes.forEach(box => {
  box.addEventListener('mouseenter', () => {
    // Controlla se l'overlay esiste già
    let overlay = box.querySelector('.overlay');
    if (!overlay) {
      const title = box.getAttribute('data-title');
      const description = box.getAttribute('data-description');
      box.innerHTML += `<div class="overlay"><h4>${title}</h4><p>${description}</p></div>`;
    }
  });
  box.addEventListener('mouseleave', () => {
    const overlay = box.querySelector('.overlay');
    if (overlay) {
      overlay.remove();
    }
  });
});

// Seleziona tutti i pulsanti "LEGGI DI PIÙ"
const leggiDiPiuButtons = document.querySelectorAll('.leggi-di-piu');

// Aggiunge un gestore di eventi al clic su ciascun pulsante "LEGGI DI PIÙ"
leggiDiPiuButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const box = button.closest('.image-box');
    const title = box.getAttribute('data-title');
    const description = box.getAttribute('data-description');
    alert(`Titolo: ${title}\nDescrizione: ${description}`);
  });
});

// Array di URL delle immagini di sfondo
const backgroundImages = [
  'https://th.bing.com/th/id/OIP.SKfWj9pm6ULP2pWAUnhyHgEyDM?rs=1&pid=ImgDetMain',
  'https://www.deabyday.tv/.imaging/default/article/guides/sport-e-fitness/allenarsi/Come-correre-in-salita-sul-tapis-roulant/imageOriginal.jpg',
  'https://th.bing.com/th/id/OIP.JdXCTH1b1_xpy4KO1SidLwHaE8?rs=1&pid=ImgDetMain',
];

let currentImageIndex = 0;

// Funzione per cambiare l'immagine di sfondo
function changeBackgroundImage() {
  const backgroundImage = document.getElementById('bg-image');
  currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
  backgroundImage.src = backgroundImages[currentImageIndex];
}

// Cambia l'immagine di sfondo ogni 5 secondi
setInterval(changeBackgroundImage, 5000);

// Integrazione dell'API di Strava
const stravaClientId = '126119';
const stravaClientSecret = '6cba0eb8ea3f1d627848c40335af0ae0b7c32345'; 
const stravaRedirectUri = 'http://localhost/strava-auth'; 
const stravaAuthUrl = 'https://www.strava.com/oauth/authorize';
const stravaTokenUrl = 'https://www.strava.com/oauth/token';
const stravaScope = 'read';

// Funzione per autenticarsi con l'API di Strava
function authenticateStrava() {
  const authParams = new URLSearchParams();
  authParams.append('client_id', stravaClientId);
  authParams.append('redirect_uri', stravaRedirectUri);
  authParams.append('response_type', 'code');
  authParams.append('scope', stravaScope);

  window.location.href = `${stravaAuthUrl}?${authParams.toString()}`;
}

// Funzione per ottenere il token di accesso di Strava
async function getStravaAccessToken(authCode) {
  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', stravaClientId);
  tokenParams.append('client_secret', stravaClientSecret);
  tokenParams.append('code', authCode);
  tokenParams.append('grant_type', 'authorization_code');

  const response = await fetch(stravaTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: tokenParams.toString()
  });

  const tokenData = await response.json();
  return tokenData.access_token;
}

// Funzione per recuperare le attività dell'utente da Strava
async function fetchStravaActivities(accessToken) {
  const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const activities = await response.json();
  return activities;
}

// Funzione per visualizzare le attività di Strava nella pagina
function displayStravaActivities(activities) {
  const activitiesList = document.createElement('ul');

  activities.forEach(activity => {
    const activityItem = document.createElement('li');
    activityItem.textContent = `${activity.name} - ${activity.distance} m`;
    activitiesList.appendChild(activityItem);
  });

  const stravaSection = document.getElementById('strava-section');
  stravaSection.innerHTML = '<h2>Attività Strava</h2>';
  stravaSection.appendChild(activitiesList);
}

// Gestione del flusso di autenticazione di Strava
async function handleStravaAuthentication() {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');

  if (authCode) {
    const accessToken = await getStravaAccessToken(authCode);
    const activities = await fetchStravaActivities(accessToken);
    displayStravaActivities(activities);
  } else {
    authenticateStrava();
  }
}

// Integrazione dell'API di YouTube
const youtubeVideoId = 'KPMnLPkJNFk';

// Funzione per caricare il video di YouTube nella pagina
function loadYouTubeVideo() {
  const videoSection = document.getElementById('video-section');
  videoSection.innerHTML = `
    <h2>Video del CUS Catania</h2>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideoId}" frameborder="0" allowfullscreen></iframe>
  `;
}

// Gestisci l'autenticazione di Strava e carica il video di YouTube quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', () => {
  handleStravaAuthentication();
  loadYouTubeVideo();
});