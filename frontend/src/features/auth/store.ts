import { makeAutoObservable } from "mobx";
import type { CurrentUser, LoginDto, RegisterCompanyDto, Role } from "./types";
import { authApi } from "./api";
import { tokenStorage } from "@/shared/api/token";
import { isApiError } from "@/shared/api/ApiError";
import { CREATABLE_ROLES, type CreatableRole } from "./permissions";

type AuthStatus = 'unknown' | 'authenticated' | 'guest' | 'unavailable';

class AuthStore {
    user: CurrentUser | null = null;
    status: AuthStatus = 'unknown';

    constructor() {
        makeAutoObservable(this);
    }

    get isAuth() {
        return this.status === 'authenticated';
    }

    get creatableRoles(): readonly CreatableRole[] {
        return this.user ? CREATABLE_ROLES[this.user.role] : [];
    }

    async init() {
        this.status = 'unknown';

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
                this.setGuest();
            } else {
                this.setUnavailable();
            }
            
        }
    }

    async login(dto: LoginDto) {
        const { access_token } = await authApi.login(dto);
        tokenStorage.set(access_token);

        const user = await authApi.me();
        this.setUser(user);
    }

    async registerCompany(dto: RegisterCompanyDto) {
        const { access_token } = await authApi.registerCompany(dto);
        tokenStorage.set(access_token);
        const user = await authApi.me();
        this.setUser(user);
    }

    hasAnyRole(roles: readonly  Role[]) {
        return this.user !== null && roles.includes(this.user.role);
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

    setUnavailable() {
        this.user = null;
        this.status = 'unavailable';
    }
}

export const authStore = new AuthStore();