document.getElementById('calculateBtn').addEventListener('click', function() {
    const quoteDate = document.getElementById('quoteDate').value;
    const salesPerson = document.getElementById('salesPerson').value;

    // 取得 MOQ 和單價的數值
    const quantity = document.querySelector('.quantity').value;
    const price = document.querySelector('.material-price').value;

    // 顯示報價結果
    const pricingResults = document.getElementById('pricingResults');
    pricingResults.innerHTML = `
        <p>日期: ${quoteDate}</p>
        <p>業務: ${salesPerson}</p>
        <p>MOQ: ${quantity}</p>
        <p>單價: ${price}</p>
    `;
});

// 下載 PNG 圖片
document.getElementById('generatePNGBtn').addEventListener('click', function () {
    // 取得報價結果區塊
    const pricingResults = document.getElementById('pricingResults');

    // 使用 html2canvas 生成 PNG
    html2canvas(pricingResults).then(function(canvas) {
        // 轉換為 PNG 並下載
        const image = canvas.toDataURL("image/png");

        // 創建下載連結
        const link = document.createElement('a');
        link.href = image;
        link.download = '報價結果.png';
        link.click();
    });
});
