import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';

/**
 * store precisa estar após a importação do 'ReactotronConfig' para ter acesso
 * às funções do SagaMonitor e do createEnhancer: */
import { store, persistor } from './store';

import GlobalStyle from './styles/global';

/**
 * Com o history.push(..) o Router escuta e executa a navegação de rota.
 */
function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Routes />
          <GlobalStyle />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
