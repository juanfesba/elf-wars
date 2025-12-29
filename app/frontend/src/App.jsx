import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'; // Import axios

function App() {
  const [count, setCount] = useState(0);
  const [backendGetData, setBackendGetData] = useState(null);
  const [backendPostData, setBackendPostData] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');       // State for name
  const [color, setColor] = useState('');     // State for color
  const [amount, setAmount] = useState('');    // State for amount

  // Function to fetch data from the backend (GET request)
  const fetchBackendGetData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/inventory');
      console.log('Data from backend (GET):', response.data);
      setBackendGetData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data (GET):', err);
      setError(err);
      setBackendGetData(null);
    }
  };

  // Function to send data to the backend (POST request)
  const sendDataToBackendPostData = async () => {
    try {
      // *** Construct the JSON payload ***
      const payload = {
        name: name,
        color: color,
        amount: parseInt(amount, 10), // Ensure amount is an integer
      };
      const response = await axios.post('http://localhost:8080/throw', payload);
      console.log('Data from backend (POST):', response.data);
      setBackendPostData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error sending data (POST):', error);
      setError(error);
      setBackendPostData(null);
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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count v0.0.1 is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button onClick={fetchBackendGetData}>
          Fetch Data from Backend (GET)
        </button>
        {backendGetData && (
          <p>Backend Data (GET): {JSON.stringify(backendGetData)}</p>
        )}
        {error && (
          <p style={{ color: 'red' }}>Error: {error.message}</p>
        )}
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={sendDataToBackendPostData}>
          Send Data to Backend (POST)
        </button>
        {backendPostData && (
          <p>Backend Data (POST): {JSON.stringify(backendPostData)}</p>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
