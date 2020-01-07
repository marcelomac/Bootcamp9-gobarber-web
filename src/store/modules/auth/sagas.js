import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    // call é responsável por chamar métodos assíncronos e que retornam promisses:
    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (!user.provider) {
      toast.error('Usuário não é prestador');
      return;
    }

    /**
     * api.defaults: seta informações que serão utilizadas em todas as
     * requisições, no caso 'token':
     */
    api.defaults.headers.Authorization = `Bearer ${token}`;

    // put dispara uma action de dentro do sagas:
    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
      provider: true,
    });

    history.push('/');
  } catch (err) {
    toast.error('Falha no cadastro, verifique seus dados!');

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  // se não houver nada no payload (é o primeiro acesso na aplicação):
  if (!payload) return;

  // se houver o token:
  const { token } = payload.auth;
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

/**
 * No saga podemos ouvir a action persist/REHYDRATE, que é disparada pelo
 * redux-persist e também possui um payload.
 * O redux-persist só deixa exibir o conteúdo da tela após ter recuperado os
 * dados de dentro da storage. Assim o token sempre vai estar presente quando
 * o usuário estiver logado e será enviado o token de autenticação a toda chamada
 * à API.
 */

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
