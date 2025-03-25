// 新增客供料
document.getElementById('addMaterialBtn').addEventListener('click', function () {
    const customerMaterials = document.getElementById('customerMaterials');
    const newMaterialGroup = document.createElement('div');
    newMaterialGroup.classList.add('material-group');
    
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.classList.add('material-price');
    priceInput.placeholder = '單價 ($)';
    priceInput.value = 0;
    
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.classList.add('material-qty');
    qtyInput.placeholder = '數量';
    qtyInput.value = 0;

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('material-total');
    totalSpan.textContent = '0';

    newMaterialGroup.appendChild(priceInput);
    newMaterialGroup.appendChild(qtyInput);
    newMaterialGroup.appendChild(totalSpan);
    customerMaterials.appendChild(newMaterialGroup);
});

// 計算報價
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

// 新增報價區間
document.getElementById('addPriceRangeBtn').addEventListener('click', function () {
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
