require('dotenv').config(); //환경변수 사용
// express에서 분리된? 미들웨어
import Koa from 'koa';
import Router from 'koa-router';
//Parse incoming request bodies in a middleware before your handlers,
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';
// import createFakeData from './createFakeData';

// 비구조화 할당을 통해 process.env 내부 값에 대한 래퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // 더미데이터 생성 함수
    // createFakeData();
  })
  .catch((e) => {
    console.log(e);
  });

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
// 클라이언트 쿠키에 token이 인증되면 state.user에 user정보 저장 후 next()
// 없으면 next()
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// build static
const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  //Not Found이고, 주소가 /api로 시작하지 않는 경우
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    //index.html 내용을 반환
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port %d`, port);
});
