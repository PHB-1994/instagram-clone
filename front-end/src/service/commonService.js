export const API_BASE_URL = "http://localhost:9000";

/**
 * 이미지 경로를 받아서 완전한 URL을 반환하는 함수
 * @param {string} path - DB에 저장된 이미지 경로
 * @returns {string} - 보여줄 수 있는 전체 이미지 URL
 */
export const getImageUrl = (path) => {
    if (!path) return '/static/img/default-avatar.jpg';
    if (path.startsWith('http')) return path;
    if (path === 'default-avatar.jpg') return '/static/img/default-avatar.jpg';
    if (path === 'default-avatar.png') return '/static/img/default-avatar.jpg';

    return `${API_BASE_URL}${path}`;
};
// 날짜 포매팅 -> 1시간전. 23시간전 처럼
/*
* commonService 에 현재 날짜를 몇 시간 전에 업로드 했는지
* <span className="story-time">
    {storyData.createdAt}
* </span>
*
* formatDate 형태로 1시간 1분전 업로드 형태 수정
* yyyy-mm-dd 형태로 수정
* */
export const formatDate = (dateString, format = "relative") => {
    // 클라이언트가 스토리를 업데이트 한 시간
    const date = new Date(dateString);
    // 현재 시간
    const now = new Date();
    // yyyy-MM-dd 로 변환
    if (format === 'absolute') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // relative 형태로 반환, 기본값으로 설정
    // now = 현재 2025년 12월 11일 10시 02분
    // date = story 를 올린 과거 시간
    const diffInMs = now - date;
    const diffInSecondes = Math.floor(diffInMs / 1000); // 1ch = 1000 초로 변환
    const diffInMinutes = Math.floor(diffInSecondes / 60); // 초를 60으로 나누면 분 단위
    const diffInHours = Math.floor(diffInMinutes / 60);    // 분을 60으로 나누면 시 단위
    const diffInDays = Math.floor(diffInHours / 24);     // 시를 24으로 나누면 날짜 단위

    if (diffInSecondes < 60) {
        return '방금 전';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} 분 전`
    } else if (diffInHours < 24) {
        const minutes = diffInMinutes % 60;
        if (minutes > 0) {
            return `${diffInHours} 시간 ${diffInMinutes % 60}분 전`
        }
        return `${diffInHours} 시간 전`
    } else if(diffInDays < 7) {
        return `${diffInDays} 일 전`
    } else {
        // 7일 이상이면 날짜 형식으로 표시
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
