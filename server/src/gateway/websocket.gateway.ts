import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Message } from 'src/message/schemas/message.schema';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: "http://localhost:5173" } })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection {
    @WebSocketServer()
    server: Server

    afterInit(server: Server) {
        server.use(async (socket, next) => {
            const token = socket.handshake.auth.token

            token ? next() : next(new Error('Authentication error'));
        })
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('client connected', client.handshake.headers);
    }

    @SubscribeMessage('createMessage')
    handleCreateMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        console.log('data', data);
    }

    @OnEvent('message.created')
    onMessageCreated(message: Message) {
        this.server.emit('message.send', message);
    }
}