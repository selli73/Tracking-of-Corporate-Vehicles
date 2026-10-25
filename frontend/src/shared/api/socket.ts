import { io, type Socket } from "socket.io-client";
import { tokenStorage } from "./token";


export const socket: Socket = io('/map', {
    autoConnect: false,
    auth: (cb) => cb({ token: tokenStorage.get() }),
});