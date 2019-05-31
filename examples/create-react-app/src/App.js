import React from 'react';
import './App.css';
import Api from '@1uphealth-temp/api';
import ProviderSearch from '@1uphealth-temp/provider-search';

import '@1uphealth-temp/provider-search/dist/index.css';

const api = new Api('elo');

function App() {
  return (
    <div className="App">
      <ProviderSearch.Base api={api}>
        <ProviderSearch.Input
          inputLabel="Providers"
          inputProps={{
            onChange: (e) => console.log(e.target.value),
            onBlur: () => console.log('BLUR!'),
            onFocus: () => console.log('FOCUS!'),
          }}
        />
        <ProviderSearch.List />
      </ProviderSearch.Base>
    </div>
  );
}

export default App;
