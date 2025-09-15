class WalletCalculator {
  constructor() {
    this.chart = null;
    this.initializeElements();
    this.bindEvents();
    this.calculate();
  }

  initializeElements() {
    this.elements = {
      material: document.getElementById('material'),
      size: document.getElementById('size'),
      quantity: document.getElementById('quantity'),
      profitMargin: document.getElementById('profitMargin'),
      profitDisplay: document.getElementById('profitDisplay'),
      
      // Features
      rfid: document.getElementById('rfid'),
      monogram: document.getElementById('monogram'),
      coinPocket: document.getElementById('coinPocket'),
      cardSlots: document.getElementById('cardSlots'),
      
      // Display elements
      materialCost: document.getElementById('materialCost'),
      sizeAdjustment: document.getElementById('sizeAdjustment'),
      featuresCost: document.getElementById('featuresCost'),
      laborCost: document.getElementById('laborCost'),
      totalCost: document.getElementById('totalCost'),
      suggestedPrice: document.getElementById('suggestedPrice'),
      profitPerUnit: document.getElementById('profitPerUnit'),
      totalRevenue: document.getElementById('totalRevenue'),
      totalProfit: document.getElementById('totalProfit'),
      
      // Pricing strategy
      budgetPrice: document.getElementById('budgetPrice'),
      standardPrice: document.getElementById('standardPrice'),
      premiumPrice: document.getElementById('premiumPrice')
    };
  }

  bindEvents() {
    this.elements.material.addEventListener('change', () => this.calculate());
    this.elements.size.addEventListener('change', () => this.calculate());
    this.elements.quantity.addEventListener('input', () => this.calculate());
    this.elements.profitMargin.addEventListener('input', () => {
      this.elements.profitDisplay.textContent = `${this.elements.profitMargin.value}%`;
      this.calculate();
    });
    
    // Feature checkboxes
    [this.elements.rfid, this.elements.monogram, this.elements.coinPocket, this.elements.cardSlots]
      .forEach(checkbox => checkbox.addEventListener('change', () => this.calculate()));
  }

  getFeaturesCost() {
    let total = 0;
    
    if (this.elements.rfid.checked) total += parseFloat(this.elements.rfid.value);
    if (this.elements.monogram.checked) total += parseFloat(this.elements.monogram.value);
    if (this.elements.coinPocket.checked) total += parseFloat(this.elements.coinPocket.value);
    if (this.elements.cardSlots.checked) total += parseFloat(this.elements.cardSlots.value);
    
    return total;
  }

  calculate() {
    // Get values
    const materialCost = parseFloat(this.elements.material.value);
    const sizeMultiplier = parseFloat(this.elements.size.value);
    const featuresCost = this.getFeaturesCost();
    const quantity = parseInt(this.elements.quantity.value) || 1;
    const profitMargin = parseFloat(this.elements.profitMargin.value) / 100;
    
    // Calculate costs
    const adjustedMaterialCost = materialCost * sizeMultiplier;
    const laborCost = 15;
    const totalUnitCost = adjustedMaterialCost + featuresCost + laborCost;
    
    // Calculate pricing
    const suggestedUnitPrice = totalUnitCost * (1 + profitMargin);
    const profitPerUnit = suggestedUnitPrice - totalUnitCost;
    
    // Bulk calculations
    const totalRevenue = suggestedUnitPrice * quantity;
    const totalProfit = profitPerUnit * quantity;
    
    // Update display
    this.updateDisplay({
      materialCost: adjustedMaterialCost,
      sizeMultiplier,
      featuresCost,
      laborCost,
      totalUnitCost,
      suggestedUnitPrice,
      profitPerUnit,
      totalRevenue,
      totalProfit
    });
    
    // Update chart
    this.updateChart({
      material: adjustedMaterialCost,
      features: featuresCost,
      labor: laborCost,
      profit: profitPerUnit
    });
    
    // Update pricing strategy
    this.updatePricingStrategy(totalUnitCost);
  }

  updateDisplay(data) {
    this.elements.materialCost.textContent = `$${data.materialCost.toFixed(2)}`;
    this.elements.sizeAdjustment.textContent = `${data.sizeMultiplier}x`;
    this.elements.featuresCost.textContent = `$${data.featuresCost.toFixed(2)}`;
    this.elements.laborCost.textContent = `$${data.laborCost.toFixed(2)}`;
    this.elements.totalCost.textContent = `$${data.totalUnitCost.toFixed(2)}`;
    this.elements.suggestedPrice.textContent = `$${data.suggestedUnitPrice.toFixed(2)}`;
    this.elements.profitPerUnit.textContent = `$${data.profitPerUnit.toFixed(2)}`;
    this.elements.totalRevenue.textContent = `$${data.totalRevenue.toFixed(2)}`;
    this.elements.totalProfit.textContent = `$${data.totalProfit.toFixed(2)}`;
  }

  updatePricingStrategy(baseCost) {
    const budgetPrice = baseCost * 1.2;
    const standardPrice = baseCost * 1.5;
    const premiumPrice = baseCost * 2.0;
    
    this.elements.budgetPrice.textContent = `$${budgetPrice.toFixed(2)}`;
    this.elements.standardPrice.textContent = `$${standardPrice.toFixed(2)}`;
    this.elements.premiumPrice.textContent = `$${premiumPrice.toFixed(2)}`;
  }

  updateChart(data) {
    const ctx = document.getElementById('costChart').getContext('2d');
    
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Material Cost', 'Features', 'Labor & Overhead', 'Profit'],
        datasets: [{
          data: [data.material, data.features, data.labor, data.profit],
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new WalletCalculator();
});