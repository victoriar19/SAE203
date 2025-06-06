// Ajoute un emoji météo aléatoire dans le titre
const emojis = ["☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "🌪️", "🌫️", "💨", "🌈"];
const Emoji = emojis[Math.floor(Math.random() * emojis.length)];
document.getElementById("emoji-title").textContent = `${Emoji} Instant Weather`;

// Ajout de la clé d'API
const CLE_API = "13c66db1c00607a0230ab3dc1503655095051b1e8d8d51052aedad1c9fe5ff55";

// Récupération des infos du formulaire : 
const formulaire = document.getElementById("formulaireMeteo");
const codePostal = document.getElementById("codePostal"); // On entre le code postal
const selectionVille = document.getElementById("selectionVille"); // On selectionne la ville correspondante
const resultat = document.getElementById("resultat"); // Zone d'affichage des résultats


// Gestion des entrées
codePostal.addEventListener("input", () => {
  // Suppression des espaces
  const codeP = codePostal.value.trim();
  // Suppression des anciennes villes
  selectionVille.innerHTML = "";
  // Première gestion des errreurs : il n'y a pas 5 chiffres 
  if(codeP.length !== 5) return;

  // Appel de L'API des communes 
  fetch(`https://geo.api.gouv.fr/communes?codePostal=${codeP}&fields=nom,code`)
    // Transformation en json
    .then(res => res.json())
    .then(communes => {
      // Gestion deuxième erreur : aucune ville trouvée 
      if(communes.length === 0){
        const option = document.createElement("option");
        option.textContent = "Aucune commune associée";
        selectionVille.appendChild(option);
        return;
      }

      // Ajout des communes dans les options affichées
      communes.forEach(commune => {
        const optionCommune = document.createElement("option");
        // Récuperation du code INSEE 
        optionCommune.value = commune.code;
        // Récupération du nom
        optionCommune.textContent = commune.nom;
        // Ajout de la commune dans les choix
        selectionVille.appendChild(optionCommune); 
      });
    })
    .catch(err => {
      // Gestion d'autres erreurs
      console.error("Erreur externe :", err)
    });
});

// Gestion de l'envoi du formulaire

formulaire.addEventListener("submit", (e) => {
  // On empêche une erreur en rechargeant la page
  e.preventDefault();

  // On récupère le code INSEE
  const codeCommune = selectionVille.value;
  // gestion erreur ville inexistante 
  if (!codeCommune) {
    resultat.textContent = "Sélectionner une ville avant d'obtenir sa météo";
    return;
  }
  // Appel de l'url de l'api meteo
  const url = `https://api.meteo-concept.com/api/forecast/daily/0?token=${CLE_API}&insee=${codeCommune}`;

  // Appel de l'api de meteo 
  fetch(url)
    // On lis le json 
    .then(res => res.json())
    .then(data => {
      // récupération des données dans le forecast
      const donneesMeteo = data.forecast;
      
      // On rajoute les informations dans la page 
      resultat.innerHTML = `
      <h2>Météo pour aujourd'hui </h2>
      <p>🌡️ Min : ${donneesMeteo.tmin} °C</p>
      <p>🌡️ Max : ${donneesMeteo.tmax} °C</p>
      <p>🌧️ Pluie : ${donneesMeteo.probarain} %</p>
      <p>☀️ Soleil : ${donneesMeteo.sun_hours} h</p>
      `;
    })
    .catch(err => {
      // gestion erreur externe 
      resultat.textContent = "Erreur sur la récupération de la météo";
      console.error(err);
    });
});