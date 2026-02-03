# Instagram Clone Project

React 기반 프론트엔드와 Spring Boot 기반 백엔드로 구성된 Instagram 클론 프로젝트입니다.  
프론트엔드와 백엔드를 분리한 구조로 설계하였으며, REST API 기반 통신과 JWT 인증 방식을 사용합니다.

---

# 1️⃣ Full Stack Overview

## 📌 프로젝트 개요

본 프로젝트는 실제 서비스 환경을 고려하여  
**프론트엔드와 백엔드를 명확히 분리한 아키텍처**로 설계되었습니다.

인증·인가 흐름을 포함한 사용자 관리와  
게시물, 댓글, 좋아요 등 사용자 상호작용 기능을 중심으로 구현했습니다.

---

## 🧱 전체 아키텍처

Client (React)
↓ Axios (REST API)
Server (Spring Boot)
↓
PostgreSQL


- 인증 방식: JWT (Access / Refresh Token)
- 통신 방식: REST API
- 실시간 기능: WebSocket 일부 적용

---

## 📁 프로젝트 구조


instagram-clone/
├── front-end/ # React 기반 프론트엔드
└── back-end/ # Spring Boot 기반 백엔드


---

## 🛠 전체 기술 스택

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Create React App

### Backend
- Java 21
- Spring Boot 3.4
- Spring Security
- JWT 인증
- JPA + MyBatis
- PostgreSQL
- WebSocket
- Swagger (Springdoc OpenAPI)

---

## 🔐 인증 흐름

- 로그인 성공 시 JWT Access Token 발급
- 이후 모든 API 요청 시 Authorization Header를 통해 토큰 전달
- 토큰 만료 시 Refresh Token을 이용해 재발급
- Spring Security Filter 단계에서 토큰 검증 처리

---

## ✨ 주요 기능

- 회원가입 / 로그인
- 게시물 등록 / 조회 / 삭제
- 댓글 및 좋아요 기능
- 사용자 프로필 조회
- WebSocket을 활용한 실시간 기능 일부 구현

