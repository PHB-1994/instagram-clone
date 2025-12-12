import axios from 'axios';

export const API_BASE_URL = 'http://localhost:9000/api';

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
        if (token) {
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
        if (error.response && error.response.status === 401) {
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
        if (res.data.token) {
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

    getPosts: async () => {
        const res = await api.get('/posts');
        // console.log(res.data);
        return res.data;
    },

    getPost: async (userId) => {
        const res = await api.get('/posts/' + userId);
        return res.data;
    },

    createPost: async (postImage, postCaption, postLocation) => {
        const formData = new FormData();
        formData.append('postImage', postImage);
        formData.append('postCaption', postCaption);
        formData.append('postLocation', postLocation);
        const res = await api.post("/posts", formData, {
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
        const res = await api.post(`/posts/${postId}/like`);
        // console.log("res.data : ", res.data);
        return res.data;
    },

    // TODO: 좋아요 취소
    // DELETE /posts/:postId/like
    removeLike: async (postId) => {
        // TODO: API 호출을 완성하세요
        const res = await api.delete(`/posts/${postId}/like`);
        // console.log("res.data : ", res.data);
        return res.data;
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

    getStory: async (userId) => {
        try {
            const res = await api.get(`/stories/user/${userId}`);
            return res.data;
        } catch (err) {
            console.error("스토리 조회 에러 : ", err.response?.data || err.message);
        }
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

    // 스토리 삭제
    deleteStory: async (storyId) => {
        const res = await api.delete(`/stories/${storyId}`);
        return res.data;
    },

    // ===== 사용자 API =====

    // TODO: 사용자 프로필 조회
    // GET /users/:userId
    getUser: async (userId) => {
        // TODO: API 호출을 완성하세요

    },

    updateProfile: async (userId, formData) => {
        try {
            const res = await api.put('/auth/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log("res.data : ", res.data);
            if (res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                const token = localStorage.getItem('token');
                if (token) {
                    localStorage.setItem('token', token);
                }
            }
            return res.data;
        } catch (error) {
            return Promise.reject(error);
        }
    },

    // TODO: 사용자 게시물 조회
    // GET /users/:userId/posts
    getUserPosts: async (userId) => {
        // TODO: API 호출을 완성하세요
    },


    // ===== 유저 검색 =====
    searchUsers: async (query) => {
        // q=${encodeURIComponent(query)}
        try {
            if (!query) return [];
            const res = await api.get(`/users/search?q=${query}`);
            return res.data;
        } catch (err) {
            console.error("유저 검색 실패 : ", err);
            return [];
        }

    },

    getUserByUsername: async (username) => {
        try {
            const res = await api.get(`/users/username/${username}`);
            return res.data;
        } catch(err) {
            console.error("유저 조회 실패 : ", err);
            return null;
        }

    },
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