import {api} from "./http"
import useAuthStore from "../store/authStore";  

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


// 4. 방명록
export const guestBook = () =>
    api.get("/guestbook/guestBookList")

// 5. 방명록 상세보기
export const guestBookDetail = (gb_idx) =>
    api.post("/guestbook/guestBookDetail", {gb_idx})

// 6. 방명록 작성
export const guestBookInsert = (formData) =>
  api.post("/guestbook/guestBookInsert", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // 7. 방명록 삭제
  export const guestBookDelete = (gb_idx,gb_pw) =>
    api.post("/guestbook/guestBookDelete", {gb_idx, gb_pw})

  // 8. 방명록 수정
export const guestBookUpdate = (formData) =>
  api.post("/guestbook/guestBookUpdate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // 9. bbs
export const bbsList = (cPage) =>
  api.get("/bbs/bbsList", {
    params: { cPage } // 쿼리 파라미터로 보냄 → /bbs/bbsList?cPage=2
  });

  // 10. bbsDetail
export const bbsDetail = (b_idx, cPage) =>
  api.get("/bbs/bbsDetail", {
    params: { b_idx, cPage }
  });

// 11. bbsWrite
export const bbsWrite = (formData) =>
  api.post("/bbs/bbsWrite", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

 // 12. bbsDelete
 export const bbsDelete = (b_idx, pwd) =>
   api.post("/bbs/bbsDelete", { b_idx, pwd }); 

 // 12. bbsUpdate
 export const bbsUpdate = (formData) =>
  api.post("/bbs/bbsUpdate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

 // 13. 비밀번호 확인
// 비밀번호 확인용
export const bbsPwdCheck = (b_idx, pwd) =>
    api.post("/bbs/bbsPwdCheck", { b_idx, pwd });

// 14. 댓글 작성
export const bbsCommWrite = (comm) =>
  api.post("/bbs/bbsCommWrite", comm);

// 15. 댓글 삭제
export const bbsCommDelete = (c_idx) => {
  return api.post("/bbs/bbsCommDelete", {c_idx});
};



// 인터셉터
// 1.모든 요청을 가로챔
// - 요청이 발생하면 인터셉터에서 config 객체를 확인한다.
// 2.특수요청 제외 
// - login, register
// 3. 제외한 나머지는 헤더에 JWT 토큰이 자동으로 추가되게 하자 

// 요청 인터셉터 (AccessToken 자동 추가)
api.interceptors.request.use(
  (config) => {
    const excludePaths = ["/members/login", "/members/register","/members/refresh", "/members/logout"];
    const isExcluded = excludePaths.some((path) => config.url.includes(path));

    if (!isExcluded) {
      const tokens = localStorage.getItem("accessToken");
      if (tokens) {
        const { accessToken } = JSON.parse(tokens);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


//  응답 인터셉터 (AccessToken 자동 재발급 + 재시도)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    // /refresh, /logout 응답은 재시도 제외 (무한 루프 방지)
    const excludeResponsePaths = ["/members/refresh", "/members/logout"];
    const isExcluded = excludeResponsePaths.some((path) => config.url.includes(path));
    if (isExcluded) {
      return Promise.reject(error);
    }

    // AccessToken 만료 → 자동 Refresh 시도
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const res = await api.post("/members/refresh");
        const { data } = res.data;
        if (!data || !data.accessToken) {
          throw new Error("AccessToken 재발급 실패");
        }
        const { accessToken } = data;
        localStorage.setItem("accessToken", JSON.stringify({ accessToken }));
        useAuthStore.getState().zu_login();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return api(config);  // 재요청
      } catch (e) {
        console.error("자동 리프레시 실패", e);
        localStorage.clear();
        useAuthStore.getState().zu_logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
