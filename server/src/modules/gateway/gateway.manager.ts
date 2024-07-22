import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GatewayManager {
    private _sockets: Map<string, Socket> = new Map();

    get sockets(): Map<string, Socket> {
        return this._sockets;
    }

    set socket({ userId, socket }: { userId: string; socket: Socket }) {
        this._sockets.set(userId, socket);
    }
}