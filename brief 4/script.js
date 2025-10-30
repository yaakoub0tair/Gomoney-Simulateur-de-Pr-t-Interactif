// ═══════════════════════════════════════════════════════════════
// 📊 ÉTAPE 1: BASE DE DONNÉES - Types de prêts et taux d'intérêt
// ═══════════════════════════════════════════════════════════════

const interestRates = [
    {
      type: "maison",
      interest: 3.2,
      label: "Maison",
      icon: "🏠",
      dureeMin: 5,
      dureeMax: 30
    },
    {
      type: "appartement",
      interest: 3.5,
      label: "Appartement",
      icon: "🏢",
      dureeMin: 5,
      dureeMax: 30
    },
    {
      type: "terrain",
      interest: 4.0,
      label: "Terrain",
      icon: "🏞️",
      dureeMin: 5,
      dureeMax: 25
    },
    {
      type: "entreprise",
      interest: 5.0,
      label: "Petite entreprise",
      icon: "💼",
      dureeMin: 2,
      dureeMax: 15
    },
    {
      type: "cash",
      interest: 6.0,
      label: "Prêt personnel",
      icon: "💰",
      dureeMin: 1,
      dureeMax: 7
    }
  ];
  
  // ═══════════════════════════════════════════════════════════════
  // 🎯 ÉTAPE 2: RÉCUPÉRATION DES ÉLÉMENTS HTML
  // ═══════════════════════════════════════════════════════════════
  
  // Formulaire
  const loanForm = document.getElementById('loanForm');
  const loanTypeSelect = document.getElementById('loan-type');
  const amountInput = document.getElementById('amount');
  const durationInput = document.getElementById('duration');
  const salaryInput = document.getElementById('salary');
  
  // Zone d'affichage
  const emptyState = document.getElementById('emptyState');
  const results = document.getElementById('results');
  
  // Éléments de résultats
  const alertMessage = document.getElementById('alertMessage');
  const loanTypeName = document.getElementById('loanTypeName');
  const monthlyAmount = document.getElementById('monthlyAmount');
  const salaryPercent = document.getElementById('salaryPercent');
  const progressBar = document.getElementById('progressBar');
  const requestedAmount = document.getElementById('requestedAmount');
  const interestRateDisplay = document.getElementById('interestRateDisplay');
  const durationDisplay = document.getElementById('durationDisplay');
  const totalInterestDisplay = document.getElementById('totalInterestDisplay');
  const totalAmountDisplay = document.getElementById('totalAmountDisplay');
  const principalBar = document.getElementById('principalBar');
  const interestBar = document.getElementById('interestBar');
  const principalPercent = document.getElementById('principalPercent');
  const interestPercent = document.getElementById('interestPercent');
  
  // ═══════════════════════════════════════════════════════════════
  // 🔧 ÉTAPE 3: FONCTIONS UTILITAIRES
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Récupérer les informations d'un type de prêt
   * @param {string} type - Le type de prêt (maison, appartement, etc.)
   * @returns {object} - L'objet contenant toutes les infos du prêt
   */
  function getLoanInfo(type) {
    return interestRates.find(item => item.type === type);
  }
  
  /**
   * Récupérer uniquement le taux d'intérêt
   * @param {string} type - Le type de prêt
   * @returns {number} - Le taux d'intérêt (ex: 3.2)
   */
  function getInterestRate(type) {
    const info = getLoanInfo(type);
    return info ? info.interest : 0;
  }
  
  /**
   * Formater un nombre avec des espaces (ex: 500000 → 500 000)
   * @param {number} number - Le nombre à formater
   * @returns {string} - Le nombre formaté
   */
  function formatNumber(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  /**
   * Vérifier si la durée est valide pour un type de prêt
   * @param {string} type - Le type de prêt
   * @param {number} duration - La durée en années
   * @returns {boolean} - true si valide, false sinon
   */
  function isDurationValid(type, duration) {
    const info = getLoanInfo(type);
    if (!info) return false;
    return duration >= info.dureeMin && duration <= info.dureeMax;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 🧮 ÉTAPE 4: CALCUL DU PRÊT (FORMULE MATHÉMATIQUE)
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Calculer tous les détails du prêt
   * @param {string} type - Type de prêt
   * @param {number} amount - Montant demandé
   * @param {number} duration - Durée en années
   * @param {number} salary - Salaire mensuel
   * @returns {object} - Objet avec tous les calculs
   */
  function calculateLoan(type, amount, duration, salary) {
    // 1. Récupérer le taux d'intérêt
    const info = getLoanInfo(type);
    const annualRate = info.interest;
    
    // 2. Convertir la durée en mois
    const months = duration * 12;
    
    // 3. Calculer le taux mensuel (taux annuel / 12)
    const monthlyRate = annualRate / 100 / 12;
    
    // 4. Formule de calcul de la mensualité (amortissement constant)
    // M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    // M = mensualité, P = montant, r = taux mensuel, n = nombre de mois
    const monthlyPayment = amount * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    
    // 5. Calculer le montant total à rembourser
    const totalAmount = monthlyPayment * months;
    
    // 6. Calculer les intérêts totaux
    const totalInterest = totalAmount - amount;
    
    // 7. Calculer le pourcentage du salaire
    const salaryPercentage = (monthlyPayment / salary) * 100;
    
    // 8. Vérifier si le prêt est accessible (< 40% du salaire)
    const isAccessible = salaryPercentage <= 40;
    
    // 9. Retourner tous les résultats dans un objet
    return {
      type: type,
      label: info.label,
      icon: info.icon,
      amount: amount,
      duration: duration,
      salary: salary,
      rate: annualRate,
      monthlyPayment: monthlyPayment,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      salaryPercentage: salaryPercentage,
      isAccessible: isAccessible,
      months: months,
      timestamp: Date.now(),
      date: new Date().toLocaleString('fr-MA')
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 🎨 ÉTAPE 5: AFFICHAGE DES RÉSULTATS
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Afficher les résultats du calcul dans l'interface
   * @param {object} loan - L'objet contenant tous les calculs
   */
  function displayResults(loan) {
    // 1. Cacher l'état vide et afficher les résultats
    emptyState.classList.add('hidden');
    results.classList.remove('hidden');
    
    // 2. Afficher le message d'alerte (accessible ou non)
    const alertBox = alertMessage.closest('.bg-emerald-50');
    const alertIcon = alertBox.querySelector('.rounded-full');
    const alertTitle = alertBox.querySelector('.font-bold');
    
    if (loan.isAccessible) {
      // Prêt accessible (vert)
      alertBox.className = 'flex gap-3 items-start bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 mb-5';
      alertIcon.className = 'w-8 h-8 bg-emerald-500 text-white flex items-center justify-center rounded-full font-bold';
      alertTitle.textContent = '✅ Prêt accessible';
      alertMessage.textContent = 'Votre mensualité représente ' + loan.salaryPercentage.toFixed(0) + '% de votre salaire.';
      alertMessage.className = 'text-sm text-emerald-800';
    } else {
      // Prêt non accessible (rouge)
      alertBox.className = 'flex gap-3 items-start bg-red-50 border-2 border-red-500 rounded-xl p-5 mb-5';
      alertIcon.className = 'w-8 h-8 bg-red-500 text-white flex items-center justify-center rounded-full font-bold';
      alertTitle.textContent = '❌ Prêt non accessible';
      alertMessage.textContent = 'Votre mensualité représente ' + loan.salaryPercentage.toFixed(0) + '% de votre salaire (limite: 40%).';
      alertMessage.className = 'text-sm text-red-800';
    }
    
    // 3. Afficher le type de prêt
    loanTypeName.textContent = loan.icon + ' ' + loan.label;
    
    // 4. Afficher la mensualité
    monthlyAmount.textContent = formatNumber(loan.monthlyPayment) + ' MAD';
    
    // 5. Afficher le pourcentage du salaire
    salaryPercent.textContent = loan.salaryPercentage.toFixed(0) + '%';
    
    // 6. Animer la barre de progression
    progressBar.style.width = Math.min(loan.salaryPercentage, 100) + '%';
    
    // Changer la couleur si > 40%
    if (loan.salaryPercentage > 40) {
      progressBar.classList.remove('bg-gray-900');
      progressBar.classList.add('bg-red-500');
    } else {
      progressBar.classList.remove('bg-red-500');
      progressBar.classList.add('bg-gray-900');
    }
    
    // 7. Afficher les détails
    requestedAmount.textContent = formatNumber(loan.amount) + ' MAD';
    interestRateDisplay.textContent = loan.rate + '%';
    durationDisplay.textContent = loan.months + ' mois (' + loan.duration + ' ans)';
    totalInterestDisplay.textContent = formatNumber(loan.totalInterest) + ' MAD';
    totalAmountDisplay.textContent = formatNumber(loan.totalAmount) + ' MAD';
    
    // 8. Calculer les pourcentages pour la répartition
    const principalPercentage = (loan.amount / loan.totalAmount) * 100;
    const interestPercentage = (loan.totalInterest / loan.totalAmount) * 100;
    
    // 9. Animer les barres de répartition
    principalBar.style.width = principalPercentage + '%';
    interestBar.style.width = interestPercentage + '%';
    
    // 10. Afficher les pourcentages
    principalPercent.textContent = 'Principal: ' + principalPercentage.toFixed(0) + '%';
    interestPercent.textContent = 'Intérêts: ' + interestPercentage.toFixed(0) + '%';
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 💾 ÉTAPE 6: GESTION DU LOCALSTORAGE
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Sauvegarder la simulation dans localStorage
   * @param {object} loan - L'objet de simulation
   */
  function saveLoan(loan) {
    // Sauvegarder la dernière simulation
    localStorage.setItem('gomoney_last', JSON.stringify(loan));
    
    // Ajouter à l'historique
    let history = JSON.parse(localStorage.getItem('gomoney_history')) || [];
    history.push(loan);
    
    // Garder seulement les 10 dernières simulations
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    localStorage.setItem('gomoney_history', JSON.stringify(history));
  }
  
  /**
   * Charger la dernière simulation
   * @returns {object|null} - L'objet de simulation ou null
   */
  function loadLastLoan() {
    const saved = localStorage.getItem('gomoney_last');
    return saved ? JSON.parse(saved) : null;
  }
  
  /**
   * Restaurer les valeurs du formulaire et afficher les résultats
   */
  function restoreLastSimulation() {
    const lastLoan = loadLastLoan();
    
    if (lastLoan) {
      // Remplir le formulaire
      loanTypeSelect.value = lastLoan.type;
      amountInput.value = lastLoan.amount;
      durationInput.value = lastLoan.duration;
      salaryInput.value = lastLoan.salary;
      
      // Afficher les résultats
      displayResults(lastLoan);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // ⚡ ÉTAPE 7: GESTION DU FORMULAIRE
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Gérer la soumission du formulaire
   */
  loanForm.addEventListener('submit', function(e) {
    // Empêcher le rechargement de la page
    e.preventDefault();
    
    // 1. Récupérer les valeurs du formulaire
    const type = loanTypeSelect.value;
    const amount = parseFloat(amountInput.value);
    const duration = parseInt(durationInput.value);
    const salary = parseFloat(salaryInput.value);
    
    // 2. Validation des données
    if (amount <= 0 || duration <= 0 || salary <= 0) {
      alert('⚠️ Veuillez entrer des valeurs valides (supérieures à 0)!');
      return;
    }
    
    // 3. Vérifier la durée selon le type de prêt
    if (!isDurationValid(type, duration)) {
      const info = getLoanInfo(type);
      alert(`⚠️ Pour ${info.label}, la durée doit être entre ${info.dureeMin} et ${info.dureeMax} ans.`);
      return;
    }
    
    // 4. Calculer le prêt
    const loan = calculateLoan(type, amount, duration, salary);
    
    // 5. Sauvegarder dans localStorage
    saveLoan(loan);
    
    // 6. Afficher les résultats
    displayResults(loan);
    
    // 7. Scroll vers les résultats (mobile friendly)
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  
  // ═══════════════════════════════════════════════════════════════
  // 🚀 ÉTAPE 8: INITIALISATION AU CHARGEMENT DE LA PAGE
  // ═══════════════════════════════════════════════════════════════
  
  window.addEventListener('load', function() {
    console.log('🎯 Gomoney - Simulateur de Prêt chargé avec succès!');
    
    // Restaurer la dernière simulation si elle existe
    restoreLastSimulation();
  });
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ FIN DU SCRIPT
  // ═══════════════════════════════════════════════════════════════