//POST는 모델이다
import Post from '../../models/posts';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

const removeHtmlAndShorten = (body) => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

// 파라미터로 입력한 id값이 올바른 문자열길이 인지 확인하는 미들웨어.
//  + 파라미터로 전달받은 id값으로 post 찾아줌
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params; // post의 고유 id
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404; //Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state; //user는 로그인한 유저 / post는 파라미터 id값 post정보
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

/*POST /api/posts
{
  title: '제목',
  body: '내용',
  tags: ['태그1', '태그2']
} 
checkLogin -> write
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), //required() 가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });
  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: sanitizeHtml(body, {
      allowedTags: [],
    }),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* GET /api/posts?username=&tag=&page= */
export const list = async (ctx) => {
  //query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  //값이 주어지지 않았다면 1을 기본으로 사용합니다.
  const page = parseInt(ctx.query.page || `1`, 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  const { tag, username } = ctx.query;
  //tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };
  console.log(query);
  try {
    const posts = await Post.find(query) // query값을 갖은 모든 Post 모델 찾음 eg) post 의 user.username 의 값으로 Post 모델을 찾음
      .sort({ _id: -1 }) //_id 값을 내림차순으로...
      .limit(10) // 10개의 값만....
      .skip((page - 1) * 10) // (page-1) * 10 만큼 skip 해서...
      .exec(); //조회 해라..
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10)); // 무조건 반올림 처리..
    ctx.body = posts.map((post) => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = async (ctx) => {
  ctx.body = ctx.state.post;
};

/*DELETE /api/posts/:id 
  checkLogedIn -> getPostById -> checkOwnPost -> remove
*/
export const remove = async (ctx) => {
  console.log('remove까지 오나?');
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; //no Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* PATCH /api/posts/:id
{
  title:'수정',
  body: '수정 내용',
  tags: ['수정', '태그']
} 
  checkLogedIn -> getPostById -> checkOwnPost -> update
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(), //문자열인지 검증
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()), // 문자열로 이루어진 배열
  });
  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const nextData = { ...ctx.request.body }; //객체를 복사하고
  //body 값이 주어졌으면 HTML 필터링
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, {
      allowedTags: [],
    });
  }
  try {
    const post = await Post.findByIdAndUpdate(id, nextData, {
      new: true, //이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false 일 때는 업데이트 되기 전의 데이터를 반환힙니다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
