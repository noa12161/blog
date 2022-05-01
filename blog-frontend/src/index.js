import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// 리덕스적용
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';
import { tempSetUser, check } from './modules/user';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

//로그인 후 페이지 새로고침 해도 로그인 유지하게 해주는 fn()
function loaderUser() {
  try {
    const user = localStorage.getItem('user');
    if (!user) return; // 로그인 상태가 아니라면 아무것도 안 함

    store.dispatch(tempSetUser(JSON.parse(user))); //redux.user.user 를 설정
    store.dispatch(check());
  } catch (e) {
    console.log('localStorage is not working');
  }
}

sagaMiddleware.run(rootSaga);
loaderUser(); // sagaMiddleware.run 이 호출된 이후에 호출하는것이 중요

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
