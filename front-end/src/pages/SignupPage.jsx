// ============================================
// src/pages/SignupPage.jsx
// TODO: 회원가입 페이지 UI 및 기능 구현
// - username, email, password, fullName state 선언
// - loading state 선언
// - handleSignup 함수: apiService.signup 호출
// - 회원가입 성공 시 /login으로 이동
// - Enter 키 입력 시 회원가입 처리
// - 입력값 검증 (이메일 형식, 사용자명 규칙, 비밀번호 길이)
// ============================================

import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';

const SignupPage = () => {
    const location = useLocation();
    console.log("kakao email : ", location.state?.email);
    console.log("kakao email : ", location.state);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const [isKakaoSignup, setIsKakaoSignup] = useState(false);

    useEffect(() => {
        if(location.state?.email) {
            // 카카오에서 넘어온 정보로 email username fullname 작성하기
            setEmail(location.state.email);
            setUsername(location.state.name);
            setFullName(location.state.fullname);
            setIsKakaoSignup(true);
        }
    }, [location.state]);

    // TODO: handleSignup 함수를 작성하세요
    // 1. 입력값 검증 (모든 필드가 비어있는지 확인)
    // 2. 이메일 형식 검증 (정규식 사용)
    // 3. 사용자명 규칙 검증 (영문, 숫자, 밑줄, 마침표만 허용, 3-50자)
    // 4. 비밀번호 길이 검증 (최소 6자)
    // 5. loading을 true로 설정
    // 6. apiService.signup(username, email, password, fullName) 호출
    // 7. 성공 시: alert로 성공 메시지, /login으로 이동
    // 8. 실패 시: alert로 에러 메시지 표시 (409: 중복, 400: 잘못된 입력)
    // 9. finally: loading을 false로 설정
    const handleSignup = async () => {
        // TODO: 함수를 완성하세요
        try {
            const response = await apiService.signup(username, email, password, fullName);
            alert("회원가입이 완료되었습니다. 로그인해주세요");
            navigate("/login");

        } catch(error) {
            let errorMessage = '회원가입에 실패했습니다.';

            if(error.response && error?.message) {
                errorMessage = error.response.data.message;
            } else if(error.response?.status === 409) {
                errorMessage = '이미 사용 중인 사용자 이름 또는 이메일입니다.';
            } else if(error.response?.status === 400) {
                errorMessage = '입력 정보를 확인해주세요.';
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // TODO: Enter 키 입력 시 handleSignup 호출하는 함수 작성
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-card">
                    <h1 className="login-title">Instagram</h1>

                    <p style={{
                        textAlign: 'center',
                        color: '#8e8e8e',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        lineHeight: '1.4'
                    }}>
                        친구들의 사진과 동영상을 보려면<br />가입하세요.
                    </p>

                    <button className="facebook-login" style={{ marginBottom: '1rem' }}>
                        <svg
                            style={{
                                width: '1rem',
                                height: '1rem',
                                marginRight: '0.5rem',
                                display: 'inline-block',
                                verticalAlign: 'middle'
                            }}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        SNS으로 로그인
                    </button>

                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">또는</span>
                        <div className="divider-line"></div>
                    </div>

                    <div>

                        {/*
                        // 매개변수가 1개일 때는 소괄호를 제거하고 작성 ok
                        onChange={ e => setEmail(e.target.value)}
                        // 소괄호를 작성해도 정상적으로 동작 ok
                        onChange={(e) => setEmail(e.target.value)}
                        // 하지만 매개변수가 존재하지 않을 때는 매개변수 자리에 빈 소괄호를 작성해야한다.
                        onChange={( ) => setEmail(e.target.value)}

                        // input 에서 change 의 경우 input 태그에 이벤트(=변화된행동)가 발생한 상황이기 때문에
                        // e 를 작성한 후 타겟의 행동에 대한 값을 가져와 input 태그를 실시간으로 change 한다.
                        */}
                        <input
                            className="login-input"
                            type="email"
                            placeholder="휴대폰 번호 또는 이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            autoComplete="email"
                            disabled={isKakaoSignup}
                            />

                        <input
                            className="login-input"
                            type="text"
                            placeholder="성명"
                            value={fullName}
                            onChange={(e) => {setFullName(e.target.value)}}
                            onKeyPress={handleKeyPress}
                            autoComplete="name"
                            disabled={isKakaoSignup}
                            />

                        <input
                            className="login-input"
                            type="text"
                            placeholder="사용자 이름"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            autoComplete="username"
                            disabled={isKakaoSignup}
                            />

                        {/* kakao 회원가입이 아닐 때는 비밀번호 입력 창 생략 */}
                        {!isKakaoSignup && (
                            <input
                                className="login-input"
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoComplete="new-password"
                            />
                        )}


                        <button className="login-button"
                                onClick={(e) => handleSignup(e)}
                                disabled={loading}>
                            {loading === true ? (
                                <div style={{opacity: '0.7', cursor : 'not-allowed'}}
                                >가입 중...</div>) : "가입"}
                        </button>
                    </div>

                    <p style={{
                        textAlign: 'center',
                        color: '#8e8e8e',
                        fontSize: '0.75rem',
                        marginTop: '1.5rem',
                        lineHeight: '1.5',
                        padding: '0 1rem'
                    }}>
                        가입하면 Instagram의 <strong style={{ fontWeight: 600 }}>약관</strong>, <strong style={{ fontWeight: 600 }}>데이터 정책</strong> 및<br />
                        <strong style={{ fontWeight: 600 }}>쿠키 정책</strong>에 동의하게 됩니다.
                    </p>
                </div>

                <div className="signup-box">
                    <p>
                        계정이 있으신가요? {' '}
                        <button
                            className="signup-link"
                            onClick={() => navigate('/login')}
                        >
                            로그인
                        </button>
                    </p>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    fontSize: '0.875rem'
                }}>
                    <p style={{ marginBottom: '1rem', color: '#262626' }}>앱을 다운로드하세요.</p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <img
                            src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                            alt="Google Play에서 다운로드"
                            style={{ height: '40px', cursor: 'pointer' }}
                        />
                        <img
                            src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
                            alt="Microsoft에서 다운로드"
                            style={{ height: '40px', cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;