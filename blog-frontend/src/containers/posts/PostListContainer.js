import { useEffect } from 'react';
import qs from 'qs';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/posts/PostList';
import { listPosts } from '../../modules/posts';

const PostListContainer = () => {
  const params = useParams();
  console.log(params);
  const dispatch = useDispatch();
  const { posts, error, loading, user } = useSelector(
    ({ posts, loading, user }) => ({
      posts: posts.posts,
      error: posts.error,
      loading: loading['posts/LIST_POSTS'],
      user: user.user,
    }),
  );

  useEffect(() => {
    // const { username } = params;
    const search = window.location.search; // ?tag=테스트
    console.log(search);
    const { tag, page, username } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    dispatch(listPosts({ tag, username, page }));
  }, [dispatch, params]);

  return (
    <PostList
      loading={loading}
      error={error}
      posts={posts}
      showWriteButton={user}
    />
  );
};

export default PostListContainer;
