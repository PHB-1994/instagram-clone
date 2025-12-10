import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService, {API_BASE_URL} from '../service/apiService';
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, PlusSquare, Film, User} from 'lucide-react';
import Header from "../components/Header";
import {getImageUrl} from "../service/commonService";

{/*하트를 클릭하면 좋아요 수 증가 */
}
const FeedPage = () => {

    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadFeedData();
    }, []);

    const loadFeedData = async () => {
        setLoading(true);

        try {
            const postData = await apiService.getPosts();
            setPosts(postData);
        } catch (error) {
            alert("포스트 피드를를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }

        try {
            const storiesData = await apiService.getStories();
            setStories(storiesData);
        } catch (error) {
            alert("스토리 피드를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (postId, isLiked) => {
        // 1. 소비자의 눈에 좋아요 취소를 보여주고, 백엔드작업 시작
        // 현재 게시물 목록 복사 (원본을 바로 건드리면 안됨)
        const newPosts = [...posts];

        // 내가 클릭한 게시물이 몇 번째에 있는지 찾습니다.
        const targetIndex = newPosts.findIndex(post => post.postId === postId);

        // 게시물을 찾았다면
        if (targetIndex !== -1) {
            // 좋아요 상태를 반대로 뒤집기(true -> false)
            newPosts[targetIndex].isLiked = !isLiked;

            // 숫자 취소 -1 차감
            if (isLiked) newPosts[targetIndex].likeCount -= 1;
            // 숫자 추가 +1 추가
            else newPosts[targetIndex].likeCount += 1;

            // 변경된 상태로 화면 업그레이드
            setPosts(newPosts);
        }
        // 소비자에게 백엔드 속도는 중요하지 않고, 눈 앞에 보여지는 화면의 속도가 우선이므로
        // 프론트엔드에서 바뀌는 작업을 보인 후 백엔드 로직 진행
        // 실패할 경우 카운트 원상복구 후 소비자에게 전달

        try {
            // 좋아요 누르고 취소가 된다. 하지만 백그라운드에서 작업 바로 보이는 상황이 아님
            if (isLiked) await apiService.removeLike(postId);
            else await apiService.addLike(postId);

            /*
            기존에는 백엔드 -> 프론트엔드 변경했다면
            수정내용은 프론트엔드 -> 백엔드 로직
            // const postsData = await apiService.getPosts();
            // setPosts(postsData);
            */

        } catch (err) {
            alert("좋아요 처리에 실패했습니다.");
            loadFeedData(); // 다시 원래대로 돌려놓기
        }
    };


    if (loading) {
        return (
            <div className="feed-container">
                <div style={{padding: '2rem', textAlign: 'center'}}>
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <Header/>

            <div className="feed-content">
                {stories.length > 0 && (
                    <div className="stories-container">
                        <div className="stories-wrapper">
                            {stories.map((story) => (
                                <div key={story.storyId}
                                     className="story-item"
                                     onClick={() => navigate(`/story/detail/${story.userId}`)}
                                >
                                    <div className="story-avatar-wrapper"
                                         key={story.id}>
                                        <img src={getImageUrl(story.userAvatar)}
                                             className="story-avatar"/>
                                    </div>
                                    <span className="story-username">
                                        {story.userName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {posts.length > 0 && (
                    posts.map((post) => (
                        <article key={post.postId} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <img src={getImageUrl(post.userAvatar)} className="post-user-avatar"/>
                                    <span className="post-username">{post.userName}</span>
                                </div>
                                <MoreHorizontal className="post-more-icon"/>
                            </div>

                            <img src={post.postImage} className="post-image"/>
                            <div className="post-content">
                                <div className="post-actions">
                                    <div className="post-actions-left">
                                        <Heart
                                            className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => toggleLike(post.postId, post.isLiked)}
                                            fill={post.isLiked ? "#ed4956" : "none"}
                                        />
                                        <MessageCircle className="action-icon"/>
                                        <Send className="action-icon"/>
                                    </div>
                                    <Bookmark className="action-icon"/>
                                </div>

                                <div className="post-likes">
                                    좋아요 {post.likeCount}개
                                </div>

                                <div className="post-caption">
                                    <span className="post-caption-username">{post.userName}</span>
                                    {post.postCaption}
                                </div>
                                {post.commentCount > 0 && (
                                    <button className="post-comments-btn">
                                        댓글{post.commentCount}개 모두 보기
                                    </button>
                                )}
                                <div className="post-time">
                                    {post.createdAt || '방금 전'}
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedPage;