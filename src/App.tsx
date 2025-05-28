import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
// import './styles/main.scss';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
       
      </main>
    </div>
  );
}

export default App;
