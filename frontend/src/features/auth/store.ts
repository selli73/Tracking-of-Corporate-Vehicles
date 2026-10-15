import { makeAutoObservable } from "mobx";
import type { CurrentUser, LoginDto } from "./types";
import { authApi } from "./api";
import { tokenStorage } from "@/shared/api/token";
import { isApiError } from "@/shared/api/ApiError";

type AuthStatus = 'unknown' | 'authenticated' | 'guest';

class AuthStore {
    user: CurrentUser | null = null;
    status: AuthStatus = 'unknown';

    constructor() {
        makeAutoObservable(this);
    }

    get isAuth() {
        return this.status === 'authenticated';
    }

    async init() {
        if (!tokenStorage.get()) {
            this.setGuest();
            return;
        }

        try {
            const user = await authApi.me();
            this.setUser(user);
        } catch(error: unknown) {
            if (isApiError(error) && error.status === 401) {
                tokenStorage.clear();
            }
            this.setGuest();
        }
    }

    async login(dto: LoginDto) {
        const { access_token } = await authApi.login(dto);
        tokenStorage.set(access_token);

        const user = await authApi.me();
        this.setUser(user);
    }

    logout() {
        tokenStorage.clear();
        this.setGuest();
    }

    setUser(user: CurrentUser) {
        this.user = user;
        this.status = 'authenticated';
    }

    setGuest() {
        this.user = null;
        this.status = 'guest';
    }
}

export const authStore = new AuthStore();