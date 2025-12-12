import React, {useState, useRef, useEffect} from 'react';
import apiService from '../service/apiService';

const MentionInput = ({value, onChange, placeholder, rows = 4}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef(null);
    const suggestionsRef = useRef(null);
    const highlightRef = useRef(null);

    const searchUsers = async (query) => {
        console.log("검색 시작 : ", query);
        if (!query || query.length < 1) {
            console.log("쿼리가 비어있어요.");
            setSuggestions([]);
            return;
        }
        try {
            const res = await apiService.searchUsers(query);
            setSuggestions(res || []);
        } catch (err) {
            console.error("유저 검색 실패 : ", err);
            setSuggestions([]);
        }
    };

    const handleTextChange = (e) => {
        const newValue = e.target.value;
        const newCursorPosition = e.target.selectionStart;

        onChange(newValue);
        setCursorPosition(newCursorPosition);

        const textBeforeCursor = newValue.substring(0, newCursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
            if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
                setShowSuggestions(true);
                searchUsers(textAfterAt);
                setSelectedIndex(0);
            } else setShowSuggestions(false);

        } else setShowSuggestions(false);
    };

    const selectUser = (user) => {
        // 1. 커서 이전/이후 텍스트 추출
        const textBeforeCursor = value.substring(0, cursorPosition);
        const textAfterCursor = value.substring(cursorPosition);

        // 2. 마지막 '@' 위치 찾기
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        // 3. '@' 이전 텍스트 + '@유저네임 ' + 커서 이후 텍스트 합치기
        if (lastAtIndex !== -1) {
            const beforeAt = textBeforeCursor.substring(0, lastAtIndex);
            const newValue = `${beforeAt}@${user.userName} ${textAfterCursor}`;
            const newCursorPos = beforeAt.length + user.userName.length + 2;

            // 4. onChange로 새로운 값 전달
            // 5. setShowSuggestions(false), setSuggestions([])
            onChange(newValue);
            setShowSuggestions(false);
            setSuggestions([]);

            // 6. setTimeout으로 textarea에 포커스하고 커서 위치 조정
            setTimeout(() => {
                if (textareaRef.current) {
                }
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            })
        }


    };

    const handleKeyDown = (e) => {
        // 1. showSuggestions가 false이거나 suggestions가 비어있으면 종료
        if (!showSuggestions || suggestions.length === 0) return;

        // 2. ArrowDown: selectedIndex 증가 (마지막이면 0으로)
        // 3. ArrowUp: selectedIndex 감소 (0이면 마지막으로)
        // 4. Enter: 현재 선택된 유저로 selectUser 호출
        // 5. Escape: setShowSuggestions(false)
        // 6. 각 케이스에서 e.preventDefault() 호출
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSuggestions((prev) => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Enter':
                if (showSuggestions && suggestions[selectedIndex]) {
                    e.preventDefault();
                    selectUser(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // 1. handleClickOutside 함수 생성
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                // 2. suggestionsRef.current 외부 클릭 시 setShowSuggestions(false)
                setShowSuggestions(false);
            }
        };
        // 3. document에 mousedown 이벤트 리스너 등록
        // 4. cleanup 함수에서 이벤트 리스너 제거
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }


    }, []);

    const highlightMentions = (text) => {
        const mentionRegex = /@(\w+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(
                <span key={match.index} style={{color: '#0095f6', fontWeight: '600'}}>
                    {match[0]}
                </span>
            )
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts;
    }

    return (
        <div style={{position: 'relative', width: '100%'}}>
            <div
                ref={highlightRef}
                className="upload-caption-input"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    color: 'transparent',
                    pointerEvents: 'none',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    background: 'transparent',
                    border: '1px solid transparent'
                }}>
                <span style={{color: '#000'}}>{highlightMentions(value)}</span>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className="upload-caption-input"
                style={{
                    position: 'relative',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: '#000'
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="mention-suggestions"
                >
                    {suggestions.map((user, index) => (
                        <div
                            key={user.userId}
                            className={`mention-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => selectUser(user)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <img
                                src={user.userAvatar || '/static/img/default-avatar.jpg'}
                                alt={user.userName}
                                className="mention-avatar"
                            />
                            <div className="mention-info">
                                <div className="mention-username">{user.userName}</div>
                                {user.userFullname && (
                                    <div className="mention-fullname">{user.userFullname}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentionInput;