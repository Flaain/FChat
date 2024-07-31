import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GatewayManager {
    private _sockets: Map<string, Array<Socket>> = new Map();

    get sockets(): Map<string, Array<Socket>> {
        return this._sockets;
    }

    set socket({ userId, socket }: { userId: string; socket: Socket }) {
        const sockets = this.sockets.get(userId);

        this._sockets.set(userId, sockets ? [...sockets, socket] : [socket]);
    }

    removeSocket = ({ userId, socket }: { userId: string; socket: Socket }) => {
        this._sockets.set(userId, this.sockets.get(userId).filter((client) => client.id !== socket.id));
    }
}
