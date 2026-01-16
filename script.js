// 新增客供料
document.getElementById('addMaterialBtn').addEventListener('click', function () {
    const customerMaterials = document.getElementById('customerMaterials');
    const newMaterialGroup = document.createElement('div');
    newMaterialGroup.classList.add('material-group');
    
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.classList.add('material-price');
    priceInput.placeholder = '單價';
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
    
    // 2. 計算客供料總成本，並加上 3% 損耗 (客供料總額 * 1.03)
    let rawMaterialSum = 0;
    document.querySelectorAll('.material-group').forEach(group => {
        const price = parseFloat(group.querySelector('.material-price').value) || 0;
        const qty = parseFloat(group.querySelector('.material-qty').value) || 0;
        const subtotal = price * qty;
        group.querySelector('.material-total').textContent = `$${subtotal.toFixed(2)}`;
        rawMaterialSum += subtotal;
    });
    
    // 客供料部分套用 1.03 
    const totalMaterialCost = rawMaterialSum * 1.03; 

    // 3. 算出該次計算的「總成本」
    const totalCost = factoryCost + totalMaterialCost + otherCosts;

    // 4. 計算各利潤率對應的價格
    const profits = document.querySelectorAll('.profit');
    const quantities = document.querySelectorAll('.quantity'); // 僅用於標記
    let pricingResults = '';

    profits.forEach((profitInput, index) => {
        const profitPercent = parseFloat(profitInput.value) || 0;
        const profitRate = profitPercent / 100;
        const moqLabel = quantities[index] ? quantities[index].value : '-';

        // 檢查利潤率是否合法 (不可等於或大於 100%)
        if (profitRate < 1) {
            // 核心公式：價格 = 總成本 / (1 - 利潤率)
            const finalPrice = totalCost / (1 - profitRate);

            pricingResults += `
                <div class="result-item" style="margin-bottom: 8px; font-size: 1.1em;">
                    <strong>MOQ ${moqLabel}:</strong> 
                    <span style="color: #d9534f; font-weight: bold; margin-left: 10px;">
                        $${finalPrice.toFixed(2)}
                    </span>
                    <small style="color: #777; margin-left: 10px;">(利潤率: ${profitPercent}%)</small>
                </div>`;
        } else {
            pricingResults += `<p style="color: red;">利潤率不能大於或等於 100%</p>`;
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
