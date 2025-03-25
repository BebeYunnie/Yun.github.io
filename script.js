document.getElementById('calculateBtn').addEventListener('click', function () {
    const factoryCost = parseFloat(document.getElementById('factoryCost').value) || 0;
    
    let totalMaterialCost = 0;
    document.querySelectorAll('.material-group').forEach(group => {
        const price = parseFloat(group.querySelector('.material-price').value) || 0;
        const qty = parseInt(group.querySelector('.material-qty').value) || 0;
        const total = price * qty;
        group.querySelector('.material-total').textContent = `$${total.toFixed(2)}`;
        totalMaterialCost += total;
    });

    const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;
    const totalCost = factoryCost + totalMaterialCost + otherCosts;

    const quantities = document.querySelectorAll('.quantity');
    const profits = document.querySelectorAll('.profit');
    let pricingResults = '';

    quantities.forEach((quantityInput, index) => {
        const quantity = parseInt(quantityInput.value) || 0;
        const profit = parseFloat(profits[index].value) || 0;
        const totalPrice = totalCost + (profit / 100) * totalCost;

        if (quantity > 0) {
            pricingResults += `<p>MOQ: ${quantity} | 利潤: ${profit}% | 單價: $${totalPrice.toFixed(2)}</p>`;
        }
    });

    document.getElementById('pricingResults').innerHTML = `<h2>報價結果</h2>${pricingResults}`;
});

// 新增數量區間
document.getElementById('addQuantityBtn').addEventListener('click', function () {
    const quantityFields = document.getElementById('quantityFields');
    const newQuantityGroup = document.createElement('div');
    newQuantityGroup.classList.add('quantity-group');
    
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.classList.add('quantity');
    quantityInput.placeholder = '數量 MOQ';
    
    const profitInput = document.createElement('input');
    profitInput.type = 'number';
    profitInput.classList.add('profit');
    profitInput.placeholder = '利潤 (%)';
    
    newQuantityGroup.appendChild(quantityInput);
    newQuantityGroup.appendChild(profitInput);
    quantityFields.appendChild(newQuantityGroup);
});

// 生成 PNG
document.getElementById('generatePNGBtn').addEventListener('click', function () {
    html2canvas(document.getElementById('pricingResults'), { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = '報價計算結果.png';
        link.click();
    });
});