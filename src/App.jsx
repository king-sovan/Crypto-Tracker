import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const[data, setData] =  useState([]);
  const[filteredData, setFilteredData] = useState([]);
  const[search, setSearch] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData(); 
  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = data.filter(coin => 
      coin.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filtered);
  }

  const sortByMarketCap = () => {
    const sorted = [...filteredData].sort((a, b) => b.market_cap - a.market_cap)
    setFilteredData(sorted);
  }

  const sortByPercentage = () => {
    const sorted = [...filteredData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    setFilteredData(sorted)
  }

  return (
    <div className='App'>
      <div className='search-container'>
        <input type='text' placeholder='Search By Name or Symbol' value={search} onChange={handleSearch}/>
        <button onClick={sortByMarketCap}>Sort By Mkt Cap</button>
        <button onClick={sortByPercentage}>Sort By Percentage</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Total Volume</th>
            <th>Market Cap</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(coin => (
            <tr key={coin.id}>
              <td><img src={coin.image} alt={coin.name} width="20" /></td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${coin.current_price}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App