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
    // 获取内容区域（包括日期、业务、MOQ和单价信息）
    const content = document.querySelector('.container');

    // 使用 html2canvas 将页面区域渲染成图像
    html2canvas(content).then(function(canvas) {
        // 创建PNG文件并下载
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = imgData;
        link.download = '報價單.png';
        link.click();
    });
});