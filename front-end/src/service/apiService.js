import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

axios.default.withCredentials = true;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 모든 요청에 JWT 토큰 추가
// 사용자의 요청을 가로채다 = interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 401 에러가 발생하면 localStorage를 비우고 /login으로 이동
/*
401 : 인증 안됨 : 로그인을 안했거나, 토큰 만료
    -> 로그인 페이지로 이동(토큰 만료, 토큰이 임의로 삭제, 잘못된 토큰 = 누군가가 토큰을 임의로 조작)
403 : 권한 없음 : 로그인은   했지만, 접근할 권한 부족 - 사업자
    -> 권한 없습니다 알림 이전 페이지로 돌려보내거나 메인 페이지로 돌려보내기
404 :      없음 : 게시물 / 사용자 / 페이지 없음
    -> 찾을 수 없습니다 알림 이전 페이지로 돌려보내거나 메인 페이지로 돌려보내기
500 : 서버 에러 : 서버 문제
    -> 고객센터 연락 방법 띄우기
 */
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

// 기능 2번과 같은 형태로 함수 활용
const apiService = {
    // ===== 인증 API =====

    // POST /auth/signup
    // body: { username, email, password, fullName }
    signup: async (username, email, password, fullName) => {
        const response = await api.post('auth/signup', {
            userName: username,
            userEmail: email,
            userPassword: password,
            userFullname: fullName,
        });
        return response.data;

    },

    // POST /auth/login
    // body: { userEmail, password }
    login: async (userEmail, password) => {
        const res = await api.post('/auth/login', {
            userEmail: userEmail,
            userPassword: password,
        });

        // 토큰과 사용자 정보를 localStorage 저장
        if(res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    },

    // TODO: 로그아웃 함수
    // localStorage에서 token과 user 제거하고 /login으로 이동
    logout: () => {
        // TODO: 로그아웃 로직을 완성하세요
    },

    // ===== 게시물 API =====

    // TODO: 모든 게시물 조회
    // GET /posts
    getPosts: async () => {
        // TODO: API 호출을 완성하세요
        const res = await api.get('/posts');
        return res.data;
    },

    // TODO: 특정 게시물 조회
    // GET /posts/:postId
    getPost: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 게시물 작성
    // POST /posts
    // body: { postImage, postCaption, postLocation }
    createPost: async (postImage, postCaption, postLocation) => {

        const formData = new FormData();
        formData.append('postImage', postImage);
        formData.append('postCaption', postCaption);
        formData.append('postLocation', postLocation);
        const res = await  api.post("/posts", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    },

    // TODO: 게시물 삭제
    // DELETE /posts/:postId
    deletePost: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 좋아요 API =====

    // TODO: 좋아요 추가
    // POST /posts/:postId/like
    addLike: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 좋아요 취소
    // DELETE /posts/:postId/like
    removeLike: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 댓글 API =====

    // TODO: 댓글 목록 조회
    // GET /posts/:postId/comments
    getComments: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 댓글 작성
    // POST /posts/:postId/comments
    // body: { commentContent }
    createComment: async (postId, commentContent) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 댓글 삭제
    // DELETE /comments/:commentId
    deleteComment: async (commentId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 스토리 API =====

    getStories: async () => {
        const res = await api.get('/stories');
        return res.data;
    },

    createStory: async (storyImage) => {
        const formData = new FormData();
        formData.append('storyImage', storyImage);

        const res = await api.post('/stories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    },

    // ===== 사용자 API =====

    // TODO: 사용자 프로필 조회
    // GET /users/:userId
    getUser: async (userId) => {
        // TODO: API 호출을 완성하세요
        const res = await api.get(`/stories/user/${userId}`);
        // console.log("res.data : ", res.data);
        return res.data;
    },

    // TODO: 사용자 게시물 조회
    // GET /users/:userId/posts
    getUserPosts: async (userId) => {
        // TODO: API 호출을 완성하세요
    }
};

export default apiService;

/*
export const 기능1번 = () => {}
const 기능2번 = {
     회원가입기능 : () => {},
     로그인기능 : () => {}
}

export  default 기능2번;
 */