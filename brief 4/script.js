const tauxPrets = {
  maison: 3.2,
  appartement: 3.5,
  terrain: 4.0,
  entreprise: 5.0,
  cash: 6.0
};

const typeLabels = {
  maison: 'Maison',
  appartement: 'Appartement',
  terrain: 'Terrain',
  entreprise: 'Petite entreprise',
  cash: 'Prêt personnel (cash)'
};

document.getElementById('loanForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const type = document.getElementById('loan-type').value;
  const montant = parseFloat(document.getElementById('amount').value);
  const duree = parseInt(document.getElementById('duration').value);
  const salaire = parseFloat(document.getElementById('salary').value);
  
  // Calcul
  const tauxAnnuel = tauxPrets[type];
  const mois = duree * 12;
  const tauxMensuel = tauxAnnuel / 100 / 12;
  const mensualite = montant * (tauxMensuel * Math.pow(1 + tauxMensuel, mois)) / (Math.pow(1 + tauxMensuel, mois) - 1);
  const total = mensualite * mois;
  const interets = total - montant;
  const pourcentage = (mensualite / salaire) * 100;
