import { createStore, compose, applyMiddleware } from 'redux';

export default (reducers, middlerares) => {
  const enhancer =
    process.env.MODE_ENV === 'development'
      ? compose(console.tron.createEnhancer(), applyMiddleware(...middlerares))
      : applyMiddleware(...middlerares);

  return createStore(reducers, enhancer);
};
