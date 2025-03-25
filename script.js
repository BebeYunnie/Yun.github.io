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
            pricingResults += `<p>MOQ: ${quantity} | 利潤: ${profit}% | 總價: $${totalPrice.toFixed(2)}</p>`;
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

// 生成 PDF
document.getElementById('generatePDFBtn').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 获取表单数据
    const quoteDate = document.getElementById('quoteDate').value || '未填寫';
    const salesPerson = document.getElementById('salesPerson').value || '未填寫';
    
    // 设置字体和字号
    doc.setFont('Helvetica');
    doc.setFontSize(12);

    // 添加標題
    doc.text("報價單", 10, 10);
    
    // 添加日期和業務信息
    doc.text(`日期: ${quoteDate}`, 10, 20);
    doc.text(`業務: ${salesPerson}`, 10, 30);

    let yPosition = 40;
    
    // 添加客供料信息
    document.querySelectorAll('.material-group').forEach((group, index) => {
        const price = group.querySelector('.material-price').value;
        const qty = group.querySelector('.material-qty').value;
        const total = (parseFloat(price) * parseInt(qty)) || 0;
        doc.text(`客供料${index + 1}: 單價 $${price}, 數量: ${qty}, 小計: $${total.toFixed(2)}`, 10, yPosition);
        yPosition += 10;
    });

    // 添加不同 MOQ 與利潤
    document.querySelectorAll('.quantity').forEach((q, i) => {
        const qty = q.value;
        const profit = document.querySelectorAll('.profit')[i].value;
        doc.text(`MOQ: ${qty}, 利潤: ${profit}%`, 10, yPosition);
        yPosition += 10;
    });

    // 保存 PDF
    doc.save("報價單.pdf");
});
