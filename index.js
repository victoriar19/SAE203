// Ajout de la clé d'API
const CLE_API = "13c66db1c00607a0230ab3dc1503655095051b1e8d8d51052aedad1c9fe5ff55";

// Récupération des infos du formulaire : 
const formulaire = document.getElementById("formulaireMeteo");
const codePostal = document.getElementById("codePostal"); // On entre le code postal
const selectionVille = document.getElementById("selectionVille"); // On selectionne la ville correspondante
const resultat = document.getElementById("resultat"); // Zone d'affichage des résultats

codePostal.addEventListener("input", () => {
  // Suppression des espaces
  const codeP = codePostal.value.trim();
  // Suppression des anciennes villes
  selectionVille.innerHTML = "";
  // Première gestion des errreurs : il n'y a pas 5 chiffres 
  if(codeP.lenght !== 5) return;

  // Appel de L'API des communes 
  fetch(`https://geo.api.gouv.fr/communes?codePostal=${codeP}&fields=nom,code`)
    // Transformation en json
    .then(res => res.json())
    .then(communes => {
      // Gestion deuxième erreur : aucune ville trouvée 
      if(communes.lenght === 0){
        const option = document.createElement("option");
        option.textContent = "Aucune commune associée";
        selectionVille.appendChild(option);
        return;
      }

      // Ajout des communes dans les options affichées
      communes.forEach(commune => {
        const optionCommune = document.createElement("option");
        // Récuperation du code INSEE 
        optionCommune.value = commune.codeP;
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