import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Message } from 'src/message/schemas/message.schema';
import { UserService } from 'src/user/user.service';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConversationService } from 'src/conversation/conversation.service';
import { CONVERSATION_EVENTS } from './utils/events';
import { EVENT_EMITTER } from './types';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly conversationService: ConversationService,
    ) {}

    private getIdByParticipants({ a, b, seperator = '-' }: { a: string; b: string; seperator?: string }) {
        return [a, b].sort().join(seperator);
    }

    afterInit(server: Server) {
        server.use(async (socket, next) => {
            const token = socket.handshake.auth.token;

            if (!token) return next(new Error('invalid token'));

            try {
                const { _id } = this.jwtService.verify<{ _id: string }>(token, {
                    secret: this.configService.get<string>('JWT_SECRET'),
                });

                const user = await this.userService.findById(_id);

                if (!user) return next(new Error('invalid user'));

                socket.data.user = user;

                next();
            } catch (error) {
                return next(error);
            }
        });
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('client connected', client.data.user._id.toString());
    }

    @SubscribeMessage(CONVERSATION_EVENTS.JOIN())
    async handleJoinConversation(
        @MessageBody() { recipientId }: { recipientId: string },
        @ConnectedSocket() client: Socket,
    ) {
        const id = this.getIdByParticipants({ a: client.data.user._id.toString(), b: recipientId });

        try {
            const recipient = await this.userService.findOneByPayload({ _id: recipientId });

            if (!recipient) throw new Error('recipient not found');

            client.join(CONVERSATION_EVENTS.ROOM(id));
        } catch (error) {
            this.server.emit(CONVERSATION_EVENTS.JOIN_ERROR(id), { error: error.message });
        }
    }

    @SubscribeMessage(CONVERSATION_EVENTS.LEAVE())
    async handleLeaveConversation(
        @MessageBody() { recipientId }: { recipientId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(CONVERSATION_EVENTS.ROOM(this.getIdByParticipants({ 
            a: client.data.user._id.toString(), 
            b: recipientId 
        })));
    }

    @OnEvent(EVENT_EMITTER.CONVERSATION_SEND_MESSAGE)
    onMessageSend({
        message,
        initiatorId,
        recipientId,
    }: {
        message: Message;
        recipientId: string;
        initiatorId: string;
    }) {
        const id = this.getIdByParticipants({ a: recipientId, b: initiatorId });
        this.server.to(CONVERSATION_EVENTS.ROOM(id)).emit(CONVERSATION_EVENTS.MESSAGE_SEND(id), message);
    }

    @OnEvent(EVENT_EMITTER.CONVERSATION_EDIT_MESSAGE)
    onMessageEdit({
        message,
        initiatorId,
        recipientId,
    }: {
        message: Message;
        recipientId: string;
        initiatorId: string;
    }) {
        console.log(message)
        const id = this.getIdByParticipants({ a: recipientId, b: initiatorId });
        this.server.to(CONVERSATION_EVENTS.ROOM(id)).emit(CONVERSATION_EVENTS.MESSAGE_EDIT(id), message);
    }
}
