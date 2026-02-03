# 📱 Instagram Clone – Frontend

본 프로젝트는 Instagram Clone 프로젝트의 **프론트엔드 영역**으로,  
사용자 화면(UI)과 사용자 인터랙션을 담당하는 React 기반 SPA 애플리케이션입니다.

백엔드(Spring Boot)와 REST API 방식으로 통신하며,  
JWT 인증 상태를 기반으로 화면을 제어합니다.

---

## 🧱 프로젝트 구조

```bash
front-end/
├─ public/
├─ src/
│ ├─ api/ # Axios API 요청 로직
│ ├─ components/ # 공통 UI 컴포넌트
│ ├─ pages/ # 화면 단위 페이지
│ ├─ hooks/ # Custom Hooks
│ ├─ styles/ # 공통 스타일
│ └─ utils/ # 공통 유틸
└─ package.json
```

---

## 🎯 프로젝트 목표

- 사용자 중심의 화면 흐름 설계
- 백엔드와 역할을 분리한 프론트엔드 구조 설계
- JWT 인증 상태 기반 화면 제어 경험
- REST API 연동 및 비동기 처리 이해
- 컴포넌트 재사용성을 고려한 UI 설계

---

## 🛠 기술 스택

- React 18
- JavaScript (ES6+)
- Axios
- HTML5 / CSS3
- Tailwind CSS

---

## ✨ 주요 기능

### 👤 인증 UI
- 회원가입 / 로그인 화면
- 로그인 상태 유지 처리
- 인증 상태에 따른 화면 분기

### 🖼 게시물 / 피드
- 게시물 목록 및 상세 화면 렌더링
- 사용자별 피드 조회
- 게시물 업로드 UI

### ❤️ 사용자 인터랙션
- 좋아요 / 댓글 UI
- 프로필 및 마이페이지 화면

---

## 🔄 프론트엔드 처리 흐름

1. 사용자가 페이지 접속
2. 로그인 성공 시 JWT 토큰 저장
3. Axios 요청 시 Authorization Header에 토큰 포함
4. 백엔드 API 응답 수신
5. 상태 업데이트 및 화면 렌더링

---

## 🚀 실행 방법

```bash
cd front-end
npm install
npm start
```

