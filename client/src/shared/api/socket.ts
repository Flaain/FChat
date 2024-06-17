import { Socket, io } from "socket.io-client";

export class SocketAPI {
    static socket: Socket | null = null;

    static createConnection = () => {
        this.socket = io(import.meta.env.VITE_BASE_URL);

        this.socket.on('connect', () => {
            console.log('connected')
        })

        this.socket.on("disconnect", () => {});
    }
}