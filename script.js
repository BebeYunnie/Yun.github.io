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

// 新增客供料
document.getElementById('addMaterialBtn').addEventListener('click', function () {
    const materialFields = document.getElementById('materialFields');
    const newMaterialGroup = document.createElement('div');
    newMaterialGroup.classList.add('material-group');

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.classList.add('material-price');
    priceInput.placeholder = '單價 ($)';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.classList.add('material-qty');
    qtyInput.placeholder = '數量';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('material-total');
    totalSpan.textContent = '$0.00';

    newMaterialGroup.appendChild(priceInput);
    newMaterialGroup.appendChild(qtyInput);
    newMaterialGroup.appendChild(totalSpan);
    materialFields.appendChild(newMaterialGroup);
});

// 生成 PDF
document.getElementById('generatePDFBtn').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 取得表單資料
    const date = document.getElementById('quoteDate').value || '未填寫';
    const sales = document.getElementById('salesPerson').value || '未填寫';
    const moq = document.getElementById('moq').value || '未填寫';
    
    // 設定標題
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("業務報價單", 80, 15);

    // 生成表格資料
    const tableData = [
        ["項目", "內容"],
        ["日期", date],
        ["業務", sales],
        ["MOQ (最小訂購量)", moq]
    ];

    // 插入表格
    doc.autoTable({
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: 30,
        theme: "grid",
        styles: { fontSize: 12, cellPadding: 5 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    let yPosition = doc.lastAutoTable.finalY + 10; // Adjust position for next content
    
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

    // 下載 PDF
    doc.save("報價單.pdf");
});
