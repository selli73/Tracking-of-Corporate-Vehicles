import { http } from "@/shared/api/http";
import type { CurrentUser, LoginDto, LoginResponse } from "./types";

export const authApi = {
    login: (dto: LoginDto) => http.post<LoginResponse>('/auth/login', dto).then((response) => response.data),

    me: () => http.get<CurrentUser>('/user/me').then((response) => response.data),
}