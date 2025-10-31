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
  
  // Affichage
  document.getElementById('emptyState').style.display = "none";
  document.getElementById('results').style.display = "block";
  
  const alerte = document.querySelector('#results > div:first-child');
  
  // Reconstruire complètement l'alerte
  if (pourcentage > 40) {
    alerte.className = "flex gap-3 items-start bg-red-50 border-2 border-red-500 rounded-xl p-5 mb-5";
    alerte.innerHTML = `
      <div class="w-8 h-8 bg-red-500 text-white flex items-center justify-center rounded-full font-bold">⚠</div>
      <div>
        <div class="font-bold mb-1">Prêt non accessible</div>
        <p class="text-sm text-red-800">Le prêt dépasse 40% de votre salaire.</p>
      </div>
    `;
  } else {
    alerte.className = "flex gap-3 items-start bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 mb-5";
    alerte.innerHTML = `
      <div class="w-8 h-8 bg-emerald-500 text-white flex items-center justify-center rounded-full font-bold">✓</div>
      <div>
        <div class="font-bold mb-1">Prêt accessible</div>
        <p class="text-sm text-emerald-800">Votre mensualité est dans les limites recommandées.</p>
      </div>
    `;
  }
  
  document.getElementById('loanTypeName').textContent = typeLabels[type];
  document.getElementById('monthlyAmount').textContent = Math.round(mensualite).toLocaleString('fr-FR') + " MAD";
  document.getElementById('salaryPercent').textContent = pourcentage.toFixed(1) + "%";
  document.getElementById('progressBar').style.width = Math.min(pourcentage, 100) + "%";
  document.getElementById('requestedAmount').textContent = Math.round(montant).toLocaleString('fr-FR') + " MAD";
  document.getElementById('interestRateDisplay').textContent = tauxAnnuel + "%";
  document.getElementById('durationDisplay').textContent = duree + " ans (" + mois + " mois)";
  document.getElementById('totalInterestDisplay').textContent = Math.round(interets).toLocaleString('fr-FR') + " MAD";
  document.getElementById('totalAmountDisplay').textContent = Math.round(total).toLocaleString('fr-FR') + " MAD";
  
  const principalPct = (montant / total) * 100;
  const interetsPct = (interets / total) * 100;
  
  document.getElementById('monthlyAmount').textContent = mensualite.toFixed(2).toLocaleString('fr-FR') + " MAD";
  document.getElementById('salaryPercent').textContent = pourcentage.toFixed(2) + "%";
  document.getElementById('requestedAmount').textContent = montant.toFixed(2).toLocaleString('fr-FR') + " MAD";
  document.getElementById('totalInterestDisplay').textContent = interets.toFixed(2).toLocaleString('fr-FR') + " MAD";
  document.getElementById('totalAmountDisplay').textContent = total.toFixed(2).toLocaleString('fr-FR') + " MAD";

});