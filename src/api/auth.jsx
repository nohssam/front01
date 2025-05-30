import {api} from "./http"

// 스프링 서버에 보낼 것을 모아 놓은 것

// 1. 로그인
export const login = (m_id, m_pw) => 
    api.post("/members/login",{m_id, m_pw})

// 2. 회원가입
export const register = (member) =>
    api.post("/members/register", member)

// 3. 마이페이지
// export const myPage =(m_idx) =>
//     api.post("/members/mypage",{m_idx})

export const myPage =() =>
    api.get("/members/mypage")

// 인터셉터
// 1.모든 요청을 가로챔
// - 요청이 발생하면 인터셉터에서 config 객체를 확인한다.
// 2.특수요청 제외 
// - login, register
// 3. 제외한 나머지는 헤더에 JWT 토큰이 자동으로 추가되게 하자 
api.interceptors.request.use(
    (config) => {
        const excludePaths = ["/members/login","/members/register"]; // 제외할 목록
        if(! excludePaths.includes(config.url)){
            const tokens = localStorage.getItem("tokens");
            if(tokens){
                const parsed = JSON.parse(tokens); // 객체로 파싱
                if(parsed.accessToken){
                    config.headers.Authorization = `Bearer ${parsed.accessToken}` // 문자열로 출력됨
                }
            }
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);
