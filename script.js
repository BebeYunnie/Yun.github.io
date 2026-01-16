// 新增客供料 (視為單件產品所需的零件)
document.getElementById('addMaterialBtn').addEventListener('click', function () {
    const customerMaterials = document.getElementById('customerMaterials');
    const newMaterialGroup = document.createElement('div');
    newMaterialGroup.classList.add('material-group');
    
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.classList.add('material-price');
    priceInput.placeholder = '單件零件單價';
    priceInput.value = 0;
    
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.classList.add('material-qty');
    qtyInput.placeholder = '用量(個)';
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
    // 1. 取得單件基礎成本
    const factoryCost = parseFloat(document.getElementById('factoryCost').value) || 0;
    const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;
    
    // 2. 計算單件客供料成本 (零件單價 * 用量 * 1.03 損耗)
    let unitMaterialSubtotal = 0;
    document.querySelectorAll('.material-group').forEach(group => {
        const price = parseFloat(group.querySelector('.material-price').value) || 0;
        const qty = parseFloat(group.querySelector('.material-qty').value) || 0;
        const subtotal = price * qty;
        group.querySelector('.material-total').textContent = `$${subtotal.toFixed(2)}`;
        unitMaterialSubtotal += subtotal;
    });
    
    // 客供料總成本 * 1.03
    const finalMaterialCost = unitMaterialSubtotal * 1.03; 

    // 3. 總成本 (單個) = 工廠成本 + 客供料成本(含損耗) + 其他雜費
    const totalCost = factoryCost + finalMaterialCost + otherCosts;

    // 4. 根據各毛利率計算單價
    const quantities = document.querySelectorAll('.quantity'); // MOQ 僅作為標記
    const profits = document.querySelectorAll('.profit');
    let pricingResults = '';

    profits.forEach((profitInput, index) => {
        const profitRate = (parseFloat(profitInput.value) || 0) / 100;
        const moqLabel = quantities[index] ? quantities[index].value : '-';

        if (profitRate < 1) {
            // 公式：單價 = 總成本 / (1 - 利潤率)
            const unitPrice = totalCost / (1 - profitRate);

            pricingResults += `
                <div class="result-item" style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>MOQ ${moqLabel}:</strong> 
                    單價 <span style="color: #e74c3c; font-weight: bold; font-size: 1.2em; margin-left: 10px;">
                        $${unitPrice.toFixed(2)}
                    </span> 
                    <small style="color: #7f8c8d; margin-left: 10px;">(利潤率: ${profitInput.value}%)</small>
                </div>`;
        }
    });

    document.getElementById('pricingResults').innerHTML = `<h2>單個單價報價</h2>${pricingResults}`;
});

// 新增報價區間 (維持 MOQ 與 利潤的對應)
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
