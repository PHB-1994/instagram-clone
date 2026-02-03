## 📸 Instagram Clone – Full Stack Monorepo

본 프로젝트는 Instagram의 핵심 기능을 직접 구현하며,  
프론트엔드와 백엔드의 역할 분리, 인증 흐름, 데이터 처리 과정을 경험하는 것을 목표로 한  
풀스택 Instagram 클론 프로젝트입니다.

React 기반 프론트엔드와 Spring Boot 기반 백엔드를 하나의 저장소에서 관리하는  
**모노레포(Monorepo) 구조**로 구성되어 있습니다.

---

## 🧱 프로젝트 구조

instagram-clone/
├─ front-end/ # React 기반 프론트엔드
├─ back-end/ # Spring Boot 기반 REST API 서버
└─ README.md # 공통 프로젝트 설명

---

## 📱 Frontend

프론트엔드는 사용자 화면(UI)과 사용자 인터랙션 처리에 집중하도록 설계되었습니다.

### 주요 역할
- 로그인 / 회원가입 화면 구현
- 게시물 목록, 상세 화면 렌더링
- 사용자 프로필 및 마이페이지 UI
- JWT 인증 상태 관리
- Axios 기반 REST API 연동

---

## 🖥 Backend

백엔드는 인증·인가와 비즈니스 로직, 데이터 처리를 담당합니다.

### 주요 역할
- 사용자, 게시물, 댓글, 좋아요 도메인 로직 처리
- JWT 기반 인증 및 인가 처리 (Spring Security)
- 데이터베이스 연동 및 트랜잭션 관리
- REST API 제공
- 일부 실시간 기능(WebSocket) 처리

---

## 🛠 기술 스택

### Frontend
- React 18
- JavaScript (ES6+)
- Axios
- HTML5 / CSS3
- Tailwind CSS

### Backend
- Java 21
- Spring Boot 3.4
- Spring Security
- JWT 인증
- JPA + MyBatis

### Database & Infra
- PostgreSQL
- (선택) AWS EC2 기반 배포 환경

---

## ✨ 주요 기능

### 👤 사용자
- 회원가입 / 로그인
- JWT 기반 인증 처리
- 로그인 상태 유지

### 🖼 게시물 (Feed)
- 게시물 업로드 및 조회
- 사용자별 피드 조회
- 게시물 상세 보기

### ❤️ 사용자 상호작용
- 좋아요 기능
- 댓글 등록 및 조회
- 사용자 프로필 기반 데이터 조회

### ⚡ 기타
- 마이페이지
- WebSocket 기반 실시간 기능 일부 구현

---

## 🔄 전체 실행 흐름

1. 사용자가 프론트엔드 페이지에 접속
2. 로그인 시 JWT Access Token 발급
3. 프론트엔드에서 API 요청 시 Authorization Header에 토큰 전달
4. 백엔드에서 토큰 검증 및 인증 처리 (Spring Security Filter)
5. 비즈니스 로직 수행 및 DB 처리
6. JSON 응답 반환
7. 프론트엔드 상태 갱신 및 화면 렌더링

---

## 🚀 실행 방법

### Frontend
```bash
cd front-end
npm install
npm start
```

### Backend
```bash
cd back-end
./gradlew bootRun
```

---

🌱 환경 변수 관리
Frontend
API 서버 주소
인증 관련 설정

```bash
.env
REACT_APP_API_URL=http://localhost:9000
```

Backend
데이터베이스 연결 정보
JWT Secret Key
application.yml

```bash
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/instagram
    username: postgres
    password: password

jwt:
  secret: your-secret-key
```

## 🎯 프로젝트 목표
- Instagram 핵심 기능 구현을 통한 실무형 풀스택 개발 경험
- 프론트엔드 / 백엔드 책임 분리 및 API 설계 역량 강화
- JWT 기반 인증·인가 흐름에 대한 이해
- 데이터 흐름 및 트랜잭션 처리 경험
- 배포 환경을 고려한 End-to-End 개발 경험

---

## 📄 상세 문서
- `front-end/README.md`  
  → 프론트엔드 구조, 주요 화면, 트러블슈팅 정리
- `back-end/README.md`  
  → 백엔드 아키텍처, 인증 구조, 트러블슈팅 정리
