import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);

  // States
  const [backendGetData, setBackendGetData] = useState([]); // Array for the list
  const [backendPostData, setBackendPostData] = useState(null); // Object for the last added item
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [amount, setAmount] = useState('');

  // Axios
  const api = axios.create({
    // This tells axios to always prefix requests with /api
    baseURL: '/api' 
  });

  // GET Request
  const fetchBackendGetData = async () => {
    try {
      const response = await api.get('/inventory');
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setBackendGetData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data (GET):', err);
      setError(err);
    }
  };

  // POST Request
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
      const response = await api.post('/throw', payload);
      setBackendPostData(response.data);
      setError(null);
      setName(''); setColor(''); setAmount('');
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

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count  v0.0.10 is {count}
        </button>
      </div>

      {/* --- FORM SECTION --- */}
      <div className="card">
        <h3>Create New Projectile</h3>
        <div className="input-group">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <button className="primary-btn" onClick={sendDataToBackendPostData}>
          Throw Ball
        </button>

        {/* --- USE OF backendPostData --- */}
        {backendPostData && (
          <div className="success-banner">
            <p>✅ <strong>Success!</strong> You just added: 
               <em> {backendPostData.name} ({backendPostData.color}) x{backendPostData.amount}</em>
            </p>
          </div>
        )}
      </div>

      {/* --- INVENTORY SECTION --- */}
      <div className="inventory-container">
        <button className="secondary-btn" onClick={fetchBackendGetData}>
          Refresh Inventory
        </button>

        {error && <p className="error-msg">Error: {error.message}</p>}

        <div className="ball-grid">
          {backendGetData?.length > 0 ? (
            backendGetData.map((ball, index) => (
              <div key={index} className="ball-card">
                <div 
                  className="color-circle" 
                  style={{ backgroundColor: ball.color?.toLowerCase() || 'gray' }}
                ></div>
                <span className="ball-name">{ball.name || 'Unknown'}</span>
                <span className="ball-amount">Stock: {ball.amount || 0}</span>
              </div>
            ))
          ) : (
            <p className="read-the-docs">Inventory is empty.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App
