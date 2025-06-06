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

// Gestion affichage dynamique des jours :

const nbJoursInput = document.getElementById("nbJours");
const valeurNbJours = document.getElementById("valeurNbJours");

nbJoursInput.addEventListener("input", () => {
  valeurNbJours.textContent = nbJoursInput.value;
})

// Gestion des entrées
codePostal.addEventListener("input", () => {
  // Suppression des espaces
  const codeP = codePostal.value.trim();
  // Suppression des anciennes villes
  selectionVille.innerHTML = "";
  // Première gestion des errreurs : il n'y a pas 5 chiffres 
  if(codeP.length !== 5) return;

  // Appel de L'API des communes 
  const apiCommune = `https://geo.api.gouv.fr/communes?codePostal=${codeP}&fields=nom,code`;
  fetch(apiCommune)
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

  // Ajout des constantes d'infos 
  const nbJours = parseInt(nbJoursInput.value, 10);
  const latitudeChecked = document.getElementById("latitude").checked;
  const longitudeChecked = document.getElementById("longitude").checked;
  const pluieChecked = document.getElementById("pluie").checked;
  const ventChecked = document.getElementById("vent").checked;
  const directionVentChecked = document.getElementById("directionVent").checked;

  // Appel de l'url de l'api meteo
  const urlMeteo = `https://api.meteo-concept.com/api/forecast/daily?token=${CLE_API}&insee=${codeCommune}`;

  // Appel de l'api de meteo 
  fetch(urlMeteo)
    // On lis le json 
    .then(res => res.json())
    .then(data => {
      // récupération des données dans le forecast
      const donneesMeteo = data.forecast.slice(0, nbJours);
      let html = `<h2>Prévisions sur ${nbJours} jour(s)</h2>`;
      
      donneesMeteo.forEach((jour, index) => {
      // On rajoute les informations dans la page 
        html += `
          <div> 
            <h3> Jour ${index +1}</h3>
            <p>🌡️ Min : ${jour.tmin} °C</p>
            <p>🌡️ Max : ${jour.tmax} °C</p>
            <p>🌧️ Pluie : ${jour.probarain} %</p>
            <p>☀️ Soleil : ${jour.sun_hours} h</p>
        `;

        // Ajout des infos ( pluie ,vent ,direction)
        if (pluieChecked) html += `<p>🌧️ Cumul pluie : ${jour.rr10} mm</p>`;
        if (ventChecked) html += `<p>💨 Vent moyen : ${jour.wind10m} km/h</p>`;
        if (directionVentChecked) html += `<p>🧭 Direction vent : ${jour.dirwind10m}°</p>`;
        html += `</div>`;
      });
      
      // Ajout des affichages de longitude et latitude 
      if (latitudeChecked || longitudeChecked) {
        const latitudeLongitude = `https://geo.api.gouv.fr/communes/${codeCommune}?fields=centre`;
        fetch(latitudeLongitude)
          .then(res => res.json())
          .then(commune => {
            if (latitudeChecked) html += `<p>📍 Latitude : ${commune.centre.coordinates[1]}</p>`;
            if (longitudeChecked) html += `<p>📍 Longitude : ${commune.centre.coordinates[0]}</p>`;
            resultat.innerHTML = html;
          })
          // Gestion erreure coordonnées 
          .catch(err => {
            resultat.innerHTML = html + "<p>(Erreur pour récupérer les coordonnées)</p>";
            console.error("Erreur coordonnées :", err);
          });
      } else {
        resultat.innerHTML = html;
      }
      
    })
    .catch(err => {
      // gestion erreur externe 
      resultat.textContent = "Erreur sur la récupération de la météo";
      console.error(err);
    });
});