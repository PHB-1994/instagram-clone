import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Grid, Bookmark, Settings } from 'lucide-react';
import apiService from "../service/apiService";
import {useNavigate} from "react-router-dom";

const MyFeedPage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate() ;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.userId;
    useEffect(() => {
        loadMyFeedData();
    }, []);

    const loadMyFeedData = async () => {
        setLoading(true);
        try {


            if (!userId) return navigate('/login');

            /*
            불필요한 게시물을 모두 가져온 후 필터 작업을 진행해야하므로
            나의 게시물만 가져오는 api를 이용하여 나의 게시물 피드 가져오도록 변경
            // 전체 게시물 가져오기
            const allPosts = await apiService.getPosts();
            // 내 게시물만 필터링
            const myPosts = allPosts.filter(post => post.userId !== userId);
             */
            const allPosts = await apiService.getPost(userId);
            setPosts(allPosts);
            console.log(allPosts);
        } catch (error) {
            console.log(error);
            alert("데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="feed-container">
            <Header type="feed" />

            <main className="profile-wrapper">
                <header className="profile-header">
                    <div className="profile-image-container">
                        <div className="profile-image-border">
                            <img
                                src={currentUser.userAvatar}
                                alt="profile"
                                className="profile-image-large"
                            />
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-title-row">
                            <h2 className="profile-username">{currentUser.userName}</h2>
                            <div className="profile-actions">
                                <button className="profile-edit-btn">프로필 편집</button>
                                <button className="profile-archive-btn">보관함 보기</button>
                                <Settings size={20} className="profile-settings-icon" />
                            </div>
                        </div>

                        <ul className="profile-stats">
                            <li>게시물 <strong>0</strong></li>
                            <li>팔로워 <strong>0</strong></li>
                            <li>팔로잉 <strong>0</strong></li>
                        </ul>

                        <div className="profile-bio-container">
                            <div className="profile-fullname">{currentUser.userFullname}</div>
                            <div className="profile-bio">{currentUser.userAvatar}</div>
                        </div>
                    </div>
                </header>

                <div className="profile-stats-mobile">
                    <div className="stat-item">
                        <span className="stat-value">{posts.length}</span>
                        <span className="stat-label">게시물</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">팔로워</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">팔로잉</span>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        <Grid size={12} /> 게시물
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        <Bookmark size={12} /> 저장됨
                    </button>
                </div>

                <div className="profile-posts-grid">
                    {posts.map((post) => (
                        <div key={post.postId} className="grid-item">
                            <img src={post.postImage} alt="post" />
                            <div className="grid-hover-overlay"></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MyFeedPage;