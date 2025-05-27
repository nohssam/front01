import {api} from "./http"

// 스프링 서버에 보낼 것을 모아 놓은 것

// 1. 로그인
export const login = (m_id, m_pw) => 
    api.post("/members/login",{m_id, m_pw})

// 2. 회원가입
export const register = (member) =>
    api.post("/members/register", member)