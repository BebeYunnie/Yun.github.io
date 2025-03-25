document.getElementById('calculateBtn').addEventListener('click', function () {
    const quoteDate = document.getElementById('quoteDate').value;
    const salesPerson = document.getElementById('salesPerson').value;
    const factoryCost = parseFloat(document.getElementById('factoryCost').value);
    const otherCosts = parseFloat(document.getElementById('otherCosts').value);

    const materials = document.querySelectorAll('.material-group');
    let totalMaterialCost = 0;
    materials.forEach(material => {
        const price = parseFloat(material.querySelector('.material-price').value);
        const qty = parseInt(material.querySelector('.material-qty').value);
        const total = price * qty;
        material.querySelector('.material-total').textContent = total.toFixed(2);
        totalMaterialCost += total;
    });

    const quantities = document.querySelectorAll('.quantity-group');
    let pricingResultsHtml = '';
    quantities.forEach(quantity => {
        const moq = parseInt(quantity.querySelector('.quantity').value);
        const profit = parseFloat(quantity.querySelector('.profit').value);

        if (moq > 0 && profit >= 0) {
            const cost = factoryCost + totalMaterialCost + otherCosts;
            const priceWithProfit = cost * (1 + profit / 100);
            pricingResultsHtml += `<p>MOQ: ${moq} 單價: $${priceWithProfit.toFixed(2)}</p>`;
        }
    });

    document.getElementById('pricingResults').innerHTML = pricingResultsHtml;
    document.getElementById('pricingResults').style.display = 'block';
});

// 下載PNG
document.getElementById('generatePNGBtn').addEventListener('click', function () {
    const pricingResults = document.getElementById('pricingResults');
    html2canvas(pricingResults, {
        useCORS: true, // 啟用 CORS 支援，避免某些圖片因跨域問題無法渲染
        logging: true, // 設為 true 可以檢查渲染過程中的 log
        allowTaint: true, // 允許渲染有問題的圖片資源
    }).then(function (canvas) {
        const link = document.createElement('a');
        link.download = '報價結果.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(function (error) {
        console.error("下載失敗:", error);
    });
});
