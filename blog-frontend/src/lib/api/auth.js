import client from './client';

// 로그인
//res = 쿠키(토큰), 비밀번호를 제외한 유저정보.
export const login = ({ username, password }) =>
  client.post('/api/auth/login', { username, password });

// 회원가입
export const register = ({ username, password }) =>
  client.post('/api/auth/register', { username, password });

// 로그인 상태 확인
export const check = () => client.get('/api/auth/check');

//로그아웃
export const logout = () => client.post('/api/auth/logout');
