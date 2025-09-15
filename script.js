class WalletPricingCalculator {
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
      profitMargin: document.getElementById('profit-margin'),
      profitDisplay: document.getElementById('profit-display'),
      
      // Checkboxes
      rfid: document.getElementById('rfid'),
      monogram: document.getElementById('monogram'),
      coinPocket: document.getElementById('coin-pocket'),
      cardSlots: document.getElementById('card-slots'),
      
      // Display elements
      materialCost: document.getElementById('material-cost'),
      sizeAdjustment: document.getElementById('size-adjustment'),
      featuresCost: document.getElementById('features-cost'),
      laborCost: document.getElementById('labor-cost'),
      totalCost: document.getElementById('total-cost'),
      suggestedPrice: document.getElementById('suggested-price'),
      profitPerUnit: document.getElementById('profit-per-unit'),
      totalRevenue: document.getElementById('total-revenue'),
      totalProfit: document.getElementById('total-profit'),
      
      // Pricing strategy
      budgetPrice: document.getElementById('budget-price'),
      standardPrice: document.getElementById('standard-price'),
      premiumPrice: document.getElementById('premium-price'),
      yourPriceRange: document.getElementById('your-price-range')
    };
  }

  bindEvents() {
    // Input change events
    this.elements.material.addEventListener('change', () => this.calculate());
    this.elements.size.addEventListener('change', () => this.calculate());
    this.elements.quantity.addEventListener('input', () => this.calculate());
    this.elements.profitMargin.addEventListener('input', () => this.updateProfitDisplay());
    
    // Feature checkboxes
    [this.elements.rfid, this.elements.monogram, this.elements.coinPocket, this.elements.cardSlots]
      .forEach(checkbox => checkbox.addEventListener('change', () => this.calculate()));
  }

  updateProfitDisplay() {
    const margin = this.elements.profitMargin.value;
    this.elements.profitDisplay.textContent = `${margin}%`;
    this.calculate();
  }

  getFeaturesCost() {
    let total = 0;
    
    if (this.elements.rfid.checked) total += 8;
    if (this.elements.monogram.checked) total += 15;
    if (this.elements.coinPocket.checked) total += 12;
    if (this.elements.cardSlots.checked) total += 6;
    
    return total;
  }

  calculate() {
    // Get base values
    const materialCost = parseFloat(this.elements.material.selectedOptions[0].dataset.cost);
    const sizeMultiplier = parseFloat(this.elements.size.selectedOptions[0].dataset.multiplier);
    const featuresCost = this.getFeaturesCost();
    const quantity = parseInt(this.elements.quantity.value) || 1;
    const profitMargin = parseFloat(this.elements.profitMargin.value) / 100;
    
    // Calculate costs
    const adjustedMaterialCost = materialCost * sizeMultiplier;
    const laborCost = 15; // Fixed labor cost
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
      totalProfit,
      quantity
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
    this.elements.yourPriceRange.textContent = `$${data.suggestedUnitPrice.toFixed(0)}`;
  }

  updatePricingStrategy(baseCost) {
    const budgetPrice = baseCost * 1.2; // 20% margin
    const standardPrice = baseCost * 1.5; // 50% margin
    const premiumPrice = baseCost * 2.0; // 100% margin
    
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
            '#3B82F6', // Blue
            '#10B981', // Green
            '#F59E0B', // Yellow
            '#EF4444'  // Red
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
              usePointStyle: true,
              font: {
                size: 12
              }
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

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new WalletPricingCalculator();
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.bg-white');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.transition = 'transform 0.2s ease-in-out';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
  
  // Add pulse animation to the main price
  const suggestedPrice = document.getElementById('suggested-price');
  setInterval(() => {
    suggestedPrice.style.transform = 'scale(1.05)';
    setTimeout(() => {
      suggestedPrice.style.transform = 'scale(1)';
    }, 200);
  }, 3000);
});