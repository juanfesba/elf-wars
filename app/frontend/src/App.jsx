import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const [backendGetData, setBackendGetData] = useState([]); 
  const [backendPostData, setBackendPostData] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [amount, setAmount] = useState('');

  // Function to fetch inventory (GET)
  const fetchBackendGetData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/inventory');
      // Ensure data is treated as an array
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setBackendGetData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data (GET):', err);
      setError(err);
      setBackendGetData([]);
    }
  };

  // Function to add a ball (POST)
  const sendDataToBackendPostData = async () => {
    if (!name || !color || !amount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        name: name,
        color: color,
        amount: parseInt(amount, 10),
      };
      const response = await axios.post('http://localhost:8080/throw', payload);
      console.log('Data from backend (POST):', response.data);
      setBackendPostData(response.data);
      setError(null);
      
      // Clear inputs after success
      setName('');
      setColor('');
      setAmount('');

      // Refresh the list automatically to show the new ball
      fetchBackendGetData();
    } catch (err) {
      console.error('Error sending data:', err);
      setError(err);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Elf Wars</h1>

      {/* --- Counter Section --- */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count v0.0.8 is {count}
        </button>
      </div>

      {/* --- Add New Ball Form --- */}
      <div className="card">
        <h3>Create New Projectile</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Ball Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Color (e.g. Blue)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button className="primary-btn" onClick={sendDataToBackendPostData}>
          Throw Ball (POST)
        </button>
      </div>

      {/* --- Inventory Display Section --- */}
      <div className="inventory-container">
        <button className="secondary-btn" onClick={fetchBackendGetData}>
          Refresh Inventory (GET)
        </button>

        {error && <p className="error-msg">Error: {error.message}</p>}

        <div className="ball-grid">
          {backendGetData.length > 0 ? (
            backendGetData.map((ball, index) => (
              <div key={index} className="ball-card">
                <div 
                  className="color-circle" 
                  style={{ backgroundColor: ball.color.toLowerCase() }}
                ></div>
                <span className="ball-name">{ball.name}</span>
                <span className="ball-amount">Stock: {ball.amount}</span>
              </div>
            ))
          ) : (
            <p className="read-the-docs">Inventory is empty. Click refresh or add a ball!</p>
          )}
        </div>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
