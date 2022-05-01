import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
  console.log(`setPassword 에서의 this: ${this}`); // 뭐가 나오지? : new User 로 만들어진 모델
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  console.log(`checkPassword 에서의 this: ${this}`); // 뭐가 나오지?
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; //true or false
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

UserSchema.methods.serialize = function () {
  console.log('serialize 에서의 this: ' + this); // 뭐가 나오지?
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣습니다.
    {
      id: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 두번째 파라미터에는 JWT 암호를 넣습니다.
    {
      expiresIn: '7d', // 7일 동안 유요함.
    },
  );
  console.log(`generateToken에서 token: ${token}`);
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
