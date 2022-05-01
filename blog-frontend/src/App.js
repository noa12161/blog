import { Routes, Route } from 'react-router-dom';

import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PostListPage />} /> {/* 모든 포스트 조회 */}
        <Route path="/@:username/:postId" element={<PostPage />} />{' '}
        {/* 특정 사용자 포스트 */}
        <Route path="/@:username" element={<PostListPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 */}
        <Route path="/register" element={<RegisterPage />} /> {/* 회원가입 */}
        <Route path="/write" element={<WritePage />} /> {/* 글쓰기 */}
        {/* 특정사용자의 특정 포스트 조회 */}
      </Routes>
    </div>
  );
}

export default App;
