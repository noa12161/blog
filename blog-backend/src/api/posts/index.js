import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.getPostById, postsCtrl.read);
posts.post('/', checkLoggedIn, postsCtrl.write);
posts.delete(
  // 요청 -> 로그인 유무 확인 -> id로받은 post정보 확인 -> 내 게시물인지 확인 ->
  '/:id',
  // state.user 없으면 return
  checkLoggedIn,
  postsCtrl.getPostById,
  postsCtrl.checkOwnPost,
  postsCtrl.remove,
);
posts.patch(
  '/:id',
  checkLoggedIn,
  postsCtrl.getPostById,
  postsCtrl.checkOwnPost,
  postsCtrl.update,
);

export default posts;
