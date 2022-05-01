import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading';

export const createRequestActionTypes = (type) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type, request) {
  // console.log('requestSaga까지 오네');
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); //로딩 시작
    try {
      //if(request === login) response = 쿠키(토큰), 비밀번호를 제외한 유저정보.
      const response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data,
        meta: response, //meta값을 response로 넣어 주면 나중에 http 헤더 및 상태 코드를 쉽게 조회 할 수 있습니다.
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    yield put(finishLoading(type)); //로딩 끝
  };
}
