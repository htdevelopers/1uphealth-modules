import React from 'react';
import './assets/styles/App.css';
import logo from './assets/img/logo.png';

function App() {
  return (
    <div className='container'>
      <div>
        <img id='logo' src={logo} alt='logo' />
      </div>
      <div className='heading'>1uphealth</div>
      <div>provider-search module</div>
    </div>
  );
}

export default App;
