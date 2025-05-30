import { create } from "zustand";

const useAuthStore = create((set) => ({
    zu_isLoggedIn : false,
    zu_login : () => set({zu_isLoggedIn : true}),
    zu_logout : () => {
         localStorage.removeItem("tokens");
         set({zu_isLoggedIn : false});
    }
}));

export default useAuthStore;