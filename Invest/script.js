// Tableau pour stocker les transactions
let transactions = [];

// Charger les transactions sauvegardées au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
});

// Configurer le graphique avec des données de base
let ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Solde',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fonction pour ajouter une transaction
function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (description.trim() !== '' && !isNaN(amount)) {
        // Créer un objet transaction
        const transaction = {
            description: description,
            amount: amount
        };

        // Ajouter la transaction au tableau
        transactions.push(transaction);

        // Mettre à jour le graphique et les statistiques
        updateChart();
        updateStatistics();

        // Sauvegarder toutes les transactions
        saveTransactions();

        // Réinitialiser les champs du formulaire
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Veuillez entrer une description et un montant valide.');
    }
}

// Fonction pour mettre à jour le graphique
function updateChart() {
    let labels = [];
    let data = [];
    let balance = 0;

    // Parcourir les transactions et calculer le solde à chaque étape
    transactions.forEach(transaction => {
        balance += transaction.amount;
        labels.push(transaction.description);
        data.push(balance);
    });
 
    // Mettre à jour les données du graphique
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();
}

// Fonction pour calculer et mettre à jour les statistiques
function updateStatistics() {
    let totalBalance = 0;
    let totalExpenses = 0;

    // Parcourir les transactions et calculer les statistiques
    transactions.forEach(transaction => {
        if (transaction.amount > 0) {
            totalBalance += transaction.amount;
        } else {
            totalExpenses -= transaction.amount;
        }
    });

    // Mettre à jour les statistiques dans le HTML
    document.getElementById('totalBalance').textContent = totalBalance.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
}

// Fonction pour sauvegarder toutes les transactions dans le stockage local
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Fonction pour charger les transactions sauvegardées depuis le stockage local
function loadTransactions() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        updateChart();
        updateStatistics();
    }
}
