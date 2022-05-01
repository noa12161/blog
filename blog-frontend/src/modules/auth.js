import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import * as authAPI from '../lib/api/auth';
// redux-saga
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';

const CHANGE_FIELD = 'auth/CHANGE_FIELD'; // 액션
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

// auth/REGISTER , auth/REGISTER_SUCCESS, auth/REGISTER_FAILURE
const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] =
  createRequestActionTypes('auth/REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] =
  createRequestActionTypes('auth/LOGIN');

// form 입력값 변경 액션함수
export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    //payload...
    form, // register, login
    key, // username, password, passwordConfirm
    value, // 실제 바꾸려는 값
  }),
);

//form 입력값 초기화 액션함수
export const initializeForm = createAction(INITIALIZE_FORM, (form) => form); //register

export const register = createAction(REGISTER, ({ username, password }) => {
  return {
    username,
    password,
  };
});
//login 액션함수
export const login = createAction(LOGIN, ({ username, password }) => ({
  username,
  password,
}));

//사가 함수
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
// 사가
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    username: '',
    password: '',
  },
  auth: null,
  authError: null,
};

const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key] = value; // eg) state.register.username을 바꾼다.
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form], // login 혹은 register 필드를 초기값(빈칸) 으로 초기화
    }),
    // 회원가입 성공
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    //  회원가입 실패
    [REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    // 로그인 성공
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth, //로그인 해서 얻은 유저 정보...(비밀번호 제외)
    }),
    // 로그인 실패
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
  },
  initialState,
);

export default auth;
