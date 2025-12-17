import React, {useEffect, useState} from 'react';
import {X, Heart, MessageCircle, Send, Bookmark, Trash2} from 'lucide-react';
import {getImageUrl} from '../service/commonService';
import Header from "../components/Header";
import PostDetailModal from "../components/PostDetailModal";
import {useNavigate, useParams} from "react-router-dom";
import apiService from "../service/apiService";
import PostOptionMenu from "../components/PostOptionMenu";
import MentionText from "../components/MentionText";

const PostDetailPage = () => {

    const {postId} = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || []);

    useEffect(() => {
        loadFeedData();
        loadComments();
    }, []);

    const loadFeedData = async () => {
        setLoading(true);

        try {
            const postsData = await apiService.getPost(postId);
            // console.log("postId : ", postId);
            // console.log("postsData : ", postsData);
            setPost(postsData);
        } catch (err) {
            alert("포스트 피드를 불러오는데 실패했습니다.")
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        setLoading(true);

        try{
            const commentData = await apiService.getComments(postId);
            console.log("commentData : ", commentData);

        } catch(err) {
            alert("댓글 조회에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteComment = () => {

    }

    const handleCommentSubmit = async (postId) => {

        try{
            console.log("postId : ", postId);
            console.log("commentText : ", commentText);
            const res = await apiService.createComment(postId, commentText);
            alert("댓글이 성공적으로 등록되었습니다.");
        } catch(err){
            alert("댓글 등록에 실패했습니다.");
        }
    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/post/${post.postId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${post.userName}의 게시물`,
                    text: post.postCaption,
                    url: shareUrl
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareUrl);
                }
            }
        } else {
            copyToClipboard(shareUrl);

        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('링크가 클립보트에 복사되었습니다.');
        }).catch(() => {
            alert("링크 복사에 실패했습니다.");
        })
    };

    const toggleLike = async (postId, isLiked) => {
        const newPosts = [...post];
        const targetIndex = newPosts.findIndex(post => post.postId === postId);

        if (targetIndex !== -1) {
            newPosts[targetIndex].isLiked = !isLiked;
            if (isLiked) newPosts[targetIndex].likeCount -= 1;
            else newPosts[targetIndex].likeCount += 1;
            setPost(newPosts);
        }

        try {
            if (isLiked) await apiService.removeLike(postId);
            else await apiService.addLike(postId);
        } catch (err) {
            alert("좋아요 처리에 실패했습니다.");
            loadFeedData();
        }
    };

    const deletePost = async (postId) => {
        try {
            await apiService.deletePost(postId);
            setPost((post.filter(p => p.postId !== postId)));
            setSelectedPost(null);
            alert("게시물이 삭제되었습니다.");
        } catch (err) {
            alert("게시물 삭제에 실패했습니다.");
        }
    }

    if (loading) {
        return (
            <div className="feed-container">
                <div style={{padding: '2rem', textAlign: 'center'}}>
                    로딩 중...
                </div>
            </div>
        );
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCommentSubmit();
        }
    };

    return (
        <div className="feed-container">
            <Header/>

            <div className="feed-content">
                <article key={post.postId} className="post-card">
                    <div className="post-header">
                        <div className="post-user-info">
                            <img src={getImageUrl(currentUser.userAvatar)}
                                 className="post-user-avatar"
                                 style={{cursor: 'pointer'}}
                                 onClick={() => navigate(`/myfeed?userId=${post.userId}`)}

                            />
                            <span className="post-username">{post.userName}</span>
                        </div>
                        <PostOptionMenu
                            post={post}
                            currentUserId={currentUser.userId}
                            onDelete={deletePost}/>
                    </div>

                    <img src={post.postImage}
                         className="post-image"
                    />
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
                            <MentionText text={post.postCaption}/>

                        </div>
                        <div className="comments-section">
                            {comments.length === 0 ? (
                                <div className="comments-empty">
                                    첫 번째 댓글을 남겨보세요!
                                </div>
                            ) : (
                                comments.map((comment, i) => (
                                    <div key={i} className="comment-item">
                                        <img className="comment-avatar"/>
                                        <div className="comment-content">
                                            <div className="comment-text">
                                                <span className="comment-username">
                                                    {comment.userName}
                                                </span>
                                                <MentionText text={comment.commentContent}/>
                                            </div>
                                            <div className="comment-time">
                                                {comment.createdAt}
                                            </div>
                                            {currentUser.userId === comment.userId && (
                                                <Trash2 size={16}
                                                        className="comment-delete-btn"
                                                        onClick={() => handleDeleteComment(comment.commentId)}/>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
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
                    <div className="comment-input-container">
                        <input
                            className="comment-input"
                            placeholder="댓글 달기 ..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="comment-post-btn"
                            style={{opacity : commentText.trim() ? 1 : 0.3}}
                            onClick={() => handleCommentSubmit(postId, commentText)}
                        >
                            게시
                        </button>
                    </div>
                </article>


            </div>

            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    currentUserId={currentUser.userId}
                    onClose={() => setSelectedPost(null)}
                    onDelete={deletePost}
                    onToggleLike={toggleLike}
                />
            )}
        </div>
    );
};

export default PostDetailPage;