async function fetchData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


function renderTable(data) {
    const tableBody = document.querySelector('#cryptoTable tbody');
    tableBody.innerHTML = ''; 
    data.forEach(coin => {
        const row = document.createElement('tr');

        const priceChangeClass = coin.price_change_percentage_24h > 0 ? 'positive-change' : 'negative-change';

        row.innerHTML = `
            <td><img src="${coin.image}" alt="${coin.name} icon"></td>
            <td>${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td class="${priceChangeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>Mkt Cap: $${coin.market_cap.toLocaleString()}</td>
        `;

        tableBody.appendChild(row);
    });
}

let cachedData = [];
fetchData().then(data => {
    cachedData = data;
    renderTable(cachedData);
});


function searchTable() {
    const searchInput = document.querySelector('#searchInput').value.toLowerCase();
    const filteredData = cachedData.filter(coin =>
        coin.name.toLowerCase().includes(searchInput) || coin.symbol.toLowerCase().includes(searchInput)
    );
    renderTable(filteredData);
}


function sortTable(key, ascending = true) {
    const sortedData = [...cachedData];
    sortedData.sort((a, b) => ascending ? a[key] - b[key] : b[key] - a[key]);
    renderTable(sortedData);
}


document.querySelector('#searchInput').addEventListener('input', searchTable);
document.querySelector('#sortMarketCapBtn').addEventListener('click', () => sortTable('market_cap', false));
document.querySelector('#sortPercentageChangeBtn').addEventListener('click', () => sortTable('price_change_percentage_24h', false));
