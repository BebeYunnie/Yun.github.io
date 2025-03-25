// script.js
document.getElementById('addQuantityBtn').addEventListener('click', function () {
    const quantityFieldsDiv = document.getElementById('quantityFields');
    const quantityGroupDiv = document.createElement('div');
    quantityGroupDiv.classList.add('quantity-group');

    const quantityIndex = quantityFieldsDiv.querySelectorAll('.quantity').length + 1;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.classList.add('quantity');
    quantityInput.id = `quantity${quantityIndex}`;
    quantityInput.placeholder = `數量 (MOQ ${quantityIndex})`;

    const profitInput = document.createElement('input');
    profitInput.type = 'number';
    profitInput.classList.add('profit');
    profitInput.id = `profit${quantityIndex}`;
    profitInput.placeholder = `利潤 (%)`;

    quantityGroupDiv.appendChild(quantityInput);
    quantityGroupDiv.appendChild(profitInput);
    quantityFieldsDiv.appendChild(quantityGroupDiv);
});

document.getElementById('calculateBtn').addEventListener('click', function () {
    const factoryCost = parseFloat(document.getElementById('factoryCost').value) || 0;
    const materialCosts = [
        parseFloat(document.getElementById('customerMaterialCost1').value) || 0,
        parseFloat(document.getElementById('customerMaterialCost2').value) || 0,
        parseFloat(document.getElementById('customerMaterialCost3').value) || 0,
        parseFloat(document.getElementById('customerMaterialCost4').value) || 0
    ];
    const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;

    const totalMaterialCost = materialCosts.reduce((sum, cost) => sum + cost, 0);
    const totalCost = factoryCost + totalMaterialCost + otherCosts;

    const quantities = document.querySelectorAll('.quantity');
    const profits = document.querySelectorAll('.profit');

    const pricingResults = [];

    quantities.forEach((quantityInput, index) => {
        const quantity = parseInt(quantityInput.value) || 0;
        const profit = parseFloat(profits[index].value) || 0;
        const profitAmount = (profit / 100) * totalCost;
        const totalPrice = totalCost + profitAmount;

        if (quantity > 0) {
            pricingResults.push({ quantity: quantity, profit: profit, totalPrice: totalPrice });
        }
    });

    const pricingResultsDiv = document.getElementById('pricingResults');
    pricingResultsDiv.innerHTML = '';

    pricingResults.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <p>數量 (MOQ): ${result.quantity}</p>
            <p>利潤: ${result.profit}%</p>
            <p>總價: $${result.totalPrice.toFixed(2)}</p>
            <hr>
        `;
        pricingResultsDiv.appendChild(resultDiv);
    });
});

// 生成 PDF
document.getElementById('generatePDFBtn').addEventListener('click', function () {
    const factoryCost = parseFloat(document.getElementById('factoryCost').value) || 0;
    const materialCosts = [
        parseFloat(document.getElementById('customerMaterialCost1').value) || 0,
        parseFloat(document.getElementById('customerMaterialCost2').value) || 0,
        parseFloat(document.getElementById('customerMaterialCost3').value) || 0,
        parseFloat(document.getElementById('customerMaterialCost4').value) || 0
    ];
    const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;

    const totalMaterialCost = materialCosts.reduce((sum, cost) => sum + cost, 0);
    const totalCost = factoryCost + totalMaterialCost + otherCosts;

    const quantities = document.querySelectorAll('.quantity');
    const profits = document.querySelectorAll('.profit');

    const pricingResults = [];

    quantities.forEach((quantityInput, index) => {
        const quantity = parseInt(quantityInput.value) || 0;
        const profit = parseFloat(profits[index].value) || 0;
        const profitAmount = (profit / 100) * totalCost;
        const totalPrice = totalCost + profitAmount;

        if (quantity > 0) {
            pricingResults.push({ quantity: quantity, profit: profit, totalPrice: totalPrice });
        }
    });

    // 使用 jsPDF 生成 PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('報價計算結果', 20, 20);

    doc.setFontSize(14);
    doc.text('數量 (MOQ)', 20, 40);
    doc.text('利潤 (%)', 80, 40);
    doc.text('總價 ($)', 140, 40);

    let yPosition = 50;

    pricingResults.forEach(result => {
        doc.text(result.quantity.toString(), 20, yPosition);
        doc.text(result.profit.toString() + '%', 80, yPosition);
        doc.text('$' + result.totalPrice.toFixed(2), 140, yPosition);
        yPosition += 10;
    });

    doc.save('報價計算結果.pdf');
});
