import { UserContext } from "../auth/user-context";

export interface RpcRequest<T> {
    user: UserContext,
    data: T
}