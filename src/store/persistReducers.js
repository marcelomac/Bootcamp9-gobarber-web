import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'gobarber',
      storage,
      whitelist: ['auth', 'user'], // nomes dos reducers que terão as info armazenadas;
    },
    reducers
  );

  return persistedReducer;
};
