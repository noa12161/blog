import Joi from 'joi';
import User from '../../models/users';

/*POST /api/auth/register
{
  username: 'david',
  password: 'david123'
} */
export const register = async (ctx) => {
  //Request Body 검증하기
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    //username 이 이미 존재하는지 확인
    const exists = await User.findByUsername(username); // ctx.request.body 에 입력한 username과 일치한 username을 갖는 User모델을 찾아서 해당 모델 객체를 반환
    if (exists) {
      ctx.status = 409; //Conflict
      return;
    }

    const user = new User({
      username,
    });
    await user.setPassword(password); //비밀번호 설정
    await user.save(); //데이터베이스에 저장
    // 응답할 데이터에서 hashedPassword 필드 제거
    ctx.body = user.serialize(); // delete를 통해 hashedPassword 필드 삭제.

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* POST /api/auth/login
{
  username: 'velopert',
  password: 'mypass123',
} */
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  // username 혹은 password가 없으면 에러처리
  if (!username || !password) {
    ctx.status = 401; //Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    // 계정이 존재하지 않으면 에러 처리
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*GET /api/auth/check */
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    // 로그인 중 아님
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

/*POST /api/auth/logout */
export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204; // no Content
};
