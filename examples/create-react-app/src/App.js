import React from 'react';
import './App.css';
import Api from '@1uphealth-temp/api';
import ProviderSearch from '@1uphealth-temp/provider-search';

const api = new Api("elo");

function App() {
  return (
    <div className="App">
      <ProviderSearch.Base
        api={api}
      >
        <ProviderSearch.Input />
        elo
        <ProviderSearch.List />
      </ProviderSearch.Base>
    </div>
  );
}

export default App;
