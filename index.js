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

  
})