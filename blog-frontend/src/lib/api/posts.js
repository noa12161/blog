import client from './client';
import qs from 'qs';

export const writePost = ({ title, body, tags }) =>
  client.post('/api/posts', { title, body, tags });

export const readPost = (id) => client.get(`/api/posts/${id}`);

/*listPosts API를 호출할 떄 파라미터로 값을 넣어주면 
  /api/posts?username=david&page=2와 같이 주소를 만들어서 호출합니다.
*/
export const listPosts = ({ tag, username, page }) => {
  console.log(tag, username, page);
  const queryString = qs.stringify({
    tag,
    username,
    page,
  });
  return client.get(`/api/posts?${queryString}`);
};

export const updatePost = ({ id, title, body, tags }) =>
  client.patch(`/api/posts/${id}`, {
    title,
    body,
    tags,
  });

export const removePost = (id) => client.delete(`/api/posts/${id}`);
