import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';
import {ArrowLeft, Image, X} from 'lucide-react';
import {getFilteredFile, FILTER_OPTIONS} from '../service/filterService';

const StoryUploadPage = () => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('none');

    const navigate = useNavigate();

    // TODO: localStorage에서 user 정보를 가져오세요 (JSON.parse 사용)
    const user = JSON.parse(localStorage.getItem('user') || []);

    // TODO: handleImageChange 함수를 작성하세요
    // 1. e.target.files[0]으로 파일 가져오기
    // 2. 파일이 있으면:
    //    - selectedImage에 파일 저장
    //    - FileReader를 생성하고 onloadend 이벤트 설정
    //    - reader.result를 imagePreview에 저장
    //    - selectedFilter를 'none'으로 초기화
    //    - reader.readAsDataURL(file) 호출
    const handleImageChange = (e) => {
        // TODO: 함수를 완성하세요
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
                setSelectedFilter('none');
            }

            reader.readAsDataURL(file)
        }
    };

    // TODO: handlePost 함수를 작성하세요
    // 1. 입력값 검증: selectedImage가 없으면 alert('이미지를 선택해주세요.') 후 return
    // 2. try-catch-finally 블록 사용
    // 3. loading을 true로 설정
    // 4. getFilteredFile(selectedImage, selectedFilter)로 필터 적용된 이미지 생성
    // 5. apiService.createStory(filteredImage) 호출
    // 6. 성공 시: alert('스토리가 성공적으로 업로드되었습니다.'), navigate('/feed')
    // 7. 실패 시: console.error, alert('스토리 업로드에 실패했습니다.')
    // 8. finally: loading을 false로 설정
    const handleStory = async () => {
        // TODO: 함수를 완성하세요
        if (!selectedImage) {
            alert("이미지를 선택해주세요");
            return;
        }

        try {
            setLoading(true);
            const filteredImage = await getFilteredFile(selectedImage, selectedFilter);
            await apiService.createStory(filteredImage);
            alert("스토리가 성공적으로 업로드되었습니다.");
            navigate("/feed");

        } catch (err) {
            console.error(err);
            alert("스토리 업로드에 실패했습니다.")

        } finally {
            setLoading(false);
        }
    };

    // TODO: handleRemoveImage 함수를 작성하세요
    // 1. selectedImage를 null로 설정
    // 2. imagePreview를 null로 설정
    // 3. selectedFilter를 'none'으로 설정
    const handleRemoveImage = () => {
        // TODO: 함수를 완성하세요
        setSelectedImage(null);
        setImagePreview(null);
        setSelectedFilter('none');
    };

    return (
        <div className="upload-container">
            <header className="upload-header">
                <div className="upload-header-content">
                    <button
                        className="upload-back-btn"
                        onClick={() => {
                            navigate("/feed")
                        }}
                    >
                        <ArrowLeft size={24}/>
                    </button>

                    <h2 className="upload-title">새 스토리</h2>

                    <button
                        className="upload-submit-btn"
                        onClick={handleStory}
                        disabled={loading || !selectedImage}
                        style={{opacity: (!selectedImage || loading) ? 0.5 : 1}}
                    >
                        {loading ? "업로드 중..." : "공유"}
                    </button>
                </div>
            </header>

            <div className="upload-content">
                <div className="upload-card">
                    <div className="upload-image-area">
                        {imagePreview ? (
                            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{position: 'relative'}}>
                                    <img src={imagePreview}
                                         alt={imagePreview}
                                         style={{filter: selectedFilter}}
                                         className="upload-preview-image"/>

                                    <button onClick={handleRemoveImage}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '2rem',
                                                height: '2rem'
                                            }}
                                    >
                                        X
                                    </button>
                                </div>

                                <div className="filter-scroll-container">
                                    {FILTER_OPTIONS.map((option) => (
                                        <div
                                            key={option.name}
                                            className={`filter-item ${selectedFilter === option.filter ? 'active' : ''}
                                             `}
                                            onClick={() => {
                                                setSelectedFilter(option.filter)
                                            }}
                                        >
                                            <span className="filter-name">{option.name}</span>

                                            <div
                                                className="filter-thumbnail"
                                                style={{
                                                    // eslint-disable-next-line no-undef
                                                    backgroundImage: `url(${imagePreview})`,
                                                    filter: option.filter,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <label className="upload-change-btn">
                                    이미지 변경
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="upload-file-input"
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="upload-label">
                                <Image className="upload-icon"/>
                                <span className="upload-text">
                                    스토리에 공유할 사진을 선택하세요
                                </span>
                                <span className="upload-select-btn">
                                    컴퓨터에서 선택
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="upload-file-input"
                                />
                            </label>
                        )}
                    </div>

                    {imagePreview && (
                        <div style={{
                            padding: '1rem',
                            borderTop: '1px solid #dbdbdb',
                            backgroundColor: '#fafafa'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#8e8e8e',
                                textAlign: 'center'
                            }}>
                                스토리는 24시간 후 자동으로 삭제됩니다
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryUploadPage;