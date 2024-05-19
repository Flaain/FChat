import { OnEvent } from '@nestjs/event-emitter';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/message/schemas/message.schema';

@WebSocketGateway({ cors: { origin: process.env.CLIENT_URL } })
export class MessageGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket, ...args: any[]) {
        console.log('client connected', client.id);
    }

    @SubscribeMessage('createMessage')
    handleCreateMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        console.log('data', data);
    }

    @OnEvent('message.created')
    onMessageCreated(message: Message) {
        console.log('data', message);
    }
}