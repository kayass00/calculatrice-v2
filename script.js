// ÉTAPE 1 : les opérations de base
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

// ÉTAPE 2 : les trois variables d'une opération (ex : 3 + 5)
let premierNombre = "";
let operateur = null;
let secondNombre = "";
let resultatAffiche = false; // true juste après "="

// ÉTAPE 3 : la fonction operate
function operate(op, a, b) {
  a = Number(a);
  b = Number(b);
  switch (op) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return null;
  }
}

// ÉTAPE 5 : l'affichage et les chiffres
const affichage = document.getElementById("affichage");

function mettreAJourAffichage(valeur) {
  affichage.textContent = valeur;
}

function saisirChiffre(chiffre) {
  if (resultatAffiche) reinitialiser(); // nouveau calcul après "="

  if (operateur === null) {
    if (premierNombre === "0") premierNombre = "";
    premierNombre += chiffre;
    mettreAJourAffichage(premierNombre);
  } else {
    if (secondNombre === "0") secondNombre = "";
    secondNombre += chiffre;
    mettreAJourAffichage(secondNombre);
  }
}

// ÉTAPE 6 : faire fonctionner la calculatrice
function arrondir(nombre) {
  return Math.round(nombre * 100000000) / 100000000;
}

function calculer() {
  // "=" trop tôt : on ne fait rien
  if (premierNombre === "" || operateur === null || secondNombre === "") {
    return false;
  }
  // division par 0 : message sarcastique
  if (operateur === "/" && Number(secondNombre) === 0) {
    reinitialiser();
    mettreAJourAffichage("÷0 ? Non. 🙄");
    return false;
  }
  const resultat = arrondir(operate(operateur, premierNombre, secondNombre));
  premierNombre = String(resultat); // le résultat devient le 1er nombre
  operateur = null;
  secondNombre = "";
  mettreAJourAffichage(premierNombre);
  return true;
}

function choisirOperateur(op) {
  if (premierNombre === "") return;
  // 12 + 7 puis "-" : on calcule d'abord 12 + 7
  if (secondNombre !== "") {
    calculer();
    if (premierNombre === "") return;
  }
  operateur = op; // opérateurs consécutifs : on garde le dernier
  resultatAffiche = false;
}

function appuyerEgal() {
  if (calculer()) resultatAffiche = true;
}

// ÉTAPE 7 : bouton clear
function reinitialiser() {
  premierNombre = "";
  operateur = null;
  secondNombre = "";
  resultatAffiche = false;
  mettreAJourAffichage("0");
}

// Branchement des boutons
document.querySelectorAll(".chiffre").forEach((bouton) => {
  bouton.addEventListener("click", () => saisirChiffre(bouton.dataset.chiffre));
});
document.querySelectorAll(".operateur").forEach((bouton) => {
  bouton.addEventListener("click", () => choisirOperateur(bouton.dataset.op));
});
document.getElementById("egal").addEventListener("click", appuyerEgal);
document.getElementById("clear").addEventListener("click", reinitialiser);

// BONUS : décimales, retour arrière, clavier
function saisirPoint() {
  if (resultatAffiche) reinitialiser();
  if (operateur === null) {
    if (premierNombre.includes(".")) return;
    premierNombre = (premierNombre === "" ? "0" : premierNombre) + ".";
    mettreAJourAffichage(premierNombre);
  } else {
    if (secondNombre.includes(".")) return;
    secondNombre = (secondNombre === "" ? "0" : secondNombre) + ".";
    mettreAJourAffichage(secondNombre);
  }
}

function effacerDernier() {
  if (resultatAffiche) return;
  if (operateur === null) {
    premierNombre = premierNombre.slice(0, -1);
    mettreAJourAffichage(premierNombre || "0");
  } else {
    secondNombre = secondNombre.slice(0, -1);
    mettreAJourAffichage(secondNombre || "0");
  }
}

document.getElementById("point").addEventListener("click", saisirPoint);
document.getElementById("retour").addEventListener("click", effacerDernier);

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") saisirChiffre(e.key);
  else if (["+", "-", "*", "/"].includes(e.key)) choisirOperateur(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); appuyerEgal(); }
  else if (e.key === "." || e.key === ",") saisirPoint();
  else if (e.key === "Backspace") effacerDernier();
  else if (e.key === "Escape") reinitialiser();
});