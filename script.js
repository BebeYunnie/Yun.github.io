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
    // 1. 取得基礎成本
    const factoryCost = parseFloat(document.getElementById('factoryCost').value) || 0;
    const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;
    
    // 2. 計算客供料總成本 (客供料總額 * 1.03)
    let rawMaterialSubtotal = 0;
    document.querySelectorAll('.material-group').forEach(group => {
        const price = parseFloat(group.querySelector('.material-price').value) || 0;
        const qty = parseInt(group.querySelector('.material-qty').value) || 0;
        const subtotal = price * qty;
        group.querySelector('.material-total').textContent = `$${subtotal.toFixed(2)}`;
        rawMaterialSubtotal += subtotal;
    });
    const totalMaterialCost = rawMaterialSubtotal * 1.03; 

    // 3. 專案總支出成本
    const totalProjectCost = factoryCost + totalMaterialCost + otherCosts;

    // 4. 計算各個 MOQ 的「報價單價」
    const quantities = document.querySelectorAll('.quantity');
    const profits = document.querySelectorAll('.profit');
    let pricingResults = '';

    quantities.forEach((quantityInput, index) => {
        const quantity = parseInt(quantityInput.value) || 0;
        const profitRate = (parseFloat(profits[index].value) || 0) / 100;

        if (quantity > 0) {
            // A. 先算出該數量下的「單位成本」
            const unitCost = totalProjectCost / quantity;
            
            // B. 套用公式：單價 = 單位成本 / (1 - 利潤率)
            const unitPrice = unitCost / (1 - profitRate);

            pricingResults += `
                <div class="result-item" style="padding: 12px; border-bottom: 1px solid #eee; font-family: sans-serif;">
                    <span style="display: inline-block; min-width: 120px;"><strong>MOQ: ${quantity}</strong></span>
                    <span style="color: #2c3e50;">單價: </span>
                    <span style="color: #e74c3c; font-weight: bold; font-size: 1.2em;">$${unitPrice.toFixed(2)}</span>
                    <span style="color: #95a5a6; margin-left: 20px; font-size: 0.9em;">(利潤率: ${profitRate * 100}%)</span>
                </div>`;
        }
    });

    document.getElementById('pricingResults').innerHTML = `<h2>報價單價結果</h2>${pricingResults}`;
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
