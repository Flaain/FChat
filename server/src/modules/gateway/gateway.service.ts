import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GatewayManager } from './gateway.manager';
import { GatewayUtils } from './gateway.utils';
import { OnEvent } from '@nestjs/event-emitter';
import {
    FEED_EVENTS,
    ConversationCreateParams,
    ConversationDeleteMessageParams,
    ConversationDeleteParams,
    ConversationSendMessageParams,
    STATIC_CONVERSATION_EVENTS,
    ConversationEditMessageParams,
} from './types';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { CONVERSATION_EVENTS } from './constants';
import { AppException } from 'src/utils/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';
import { CookiesService } from 'src/utils/services/cookies/cookies.service';
import { JWT_KEYS } from 'src/utils/types';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173', credentials: true } })
export class GatewayService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly cookiesService: CookiesService,
        private readonly jwtService: JwtService,
        private readonly gatewayManager: GatewayManager,
    ) {}

    afterInit(server: Server) {
        server.use(async (socket, next) => {
            const cookies = socket.handshake.headers.cookie;

            if (!cookies) return next(new AppException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED));

            try {
                const { accessToken } = this.cookiesService.parseCookies(cookies);
                
                if (!accessToken) return next(new AppException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED));

                const user = await this.userService.findOneByPayload({
                    _id: this.jwtService.verify<{ userId: string }>(accessToken, {
                        secret: this.configService.get(JWT_KEYS.ACCESS_TOKEN_SECRET),
                    }).userId,
                    isDeleted: false,
                });

                if (!user) return next(new AppException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED));

                socket.data.user = user;

                return next();
            } catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }

    handleConnection(client: Socket) {
        this.gatewayManager.socket = { userId: client.data.user._id.toString(), socket: client };
    }

    handleDisconnect(client: Socket) {
        this.gatewayManager.removeSocket({ userId: client.data.user._id.toString(), socket: client });
    }

    @SubscribeMessage(STATIC_CONVERSATION_EVENTS.JOIN)
    async handleJoinConversation(@MessageBody() { recipientId }: { recipientId: string }, @ConnectedSocket() client: Socket) {
        const roomId = GatewayUtils.getRoomIdByParticipants([client.data.user._id.toString(), recipientId]);

        try {
            const recipient = await this.userService.findOneByPayload({ _id: recipientId });

            if (!recipient) throw new Error('recipient not found');

            client.join(CONVERSATION_EVENTS.ROOM(roomId));
        } catch (error) {
            client.emit(CONVERSATION_EVENTS.JOIN_ERROR(roomId), { error: error.message });
        }
    }

    @SubscribeMessage(STATIC_CONVERSATION_EVENTS.LEAVE)
    async handleLeaveConversation(@MessageBody() { recipientId }: { recipientId: string }, @ConnectedSocket() client: Socket) {
        client.leave(CONVERSATION_EVENTS.ROOM(GatewayUtils.getRoomIdByParticipants([client.data.user._id.toString(), recipientId])));
    }

    @OnEvent(STATIC_CONVERSATION_EVENTS.SEND_MESSAGE)
    async onNewMessage({ message, recipientId, conversationId, initiatorId }: ConversationSendMessageParams) {
        const roomId = GatewayUtils.getRoomIdByParticipants([initiatorId, recipientId]);
        
        const initiatorSockets = this.gatewayManager.sockets.get(initiatorId);
        const recipientSockets = this.gatewayManager.sockets.get(recipientId);

        this.server.to(CONVERSATION_EVENTS.ROOM(roomId)).emit(STATIC_CONVERSATION_EVENTS.SEND_MESSAGE, message);

        [initiatorSockets, recipientSockets].forEach((sockets) => sockets?.forEach((socket) => socket.emit(FEED_EVENTS.CREATE_MESSAGE, { 
            message, conversationId 
        })));
    }

    @OnEvent(STATIC_CONVERSATION_EVENTS.EDIT_MESSAGE)
    async onEditMessage({ message, recipientId, conversationId, initiatorId, isLastMessage }: ConversationEditMessageParams) {
        const roomId = GatewayUtils.getRoomIdByParticipants([initiatorId, recipientId]);
        
        const initiatorSockets = this.gatewayManager.sockets.get(initiatorId);
        const recipientSockets = this.gatewayManager.sockets.get(recipientId);

        this.server.to(CONVERSATION_EVENTS.ROOM(roomId)).emit(STATIC_CONVERSATION_EVENTS.EDIT_MESSAGE, message);

        isLastMessage && [initiatorSockets, recipientSockets].forEach((sockets) => sockets?.forEach((socket) => socket.emit(FEED_EVENTS.EDIT_MESSAGE, {
            message,
            conversationId
        })));
    }

    @OnEvent(STATIC_CONVERSATION_EVENTS.DELETE_MESSAGE)
    async handleDeleteMessage({
        initiatorId,
        recipientId,
        conversationId,
        messageId,
        lastMessage,
        lastMessageSentAt,
        isLastMessage,
    }: ConversationDeleteMessageParams) {
        try {
            const roomId = GatewayUtils.getRoomIdByParticipants([initiatorId, recipientId]);

            const initiatorSockets = this.gatewayManager.sockets.get(initiatorId);
            const recipientSockets = this.gatewayManager.sockets.get(recipientId);

            this.server.to(CONVERSATION_EVENTS.ROOM(roomId)).emit(STATIC_CONVERSATION_EVENTS.DELETE_MESSAGE, messageId);

            isLastMessage && [initiatorSockets, recipientSockets].forEach((sockets) => {
                sockets?.forEach((socket) => socket.emit(FEED_EVENTS.DELETE_MESSAGE, { conversationId, lastMessage, lastMessageSentAt }));
            });
        } catch (error) {
            // client.emit('', { error: error.message });
        }
    }

    @OnEvent(STATIC_CONVERSATION_EVENTS.CREATED)
    async onConversationCreated({ initiatorId, conversationId, recipient, lastMessageSentAt }: ConversationCreateParams) {
        const newConversation = { _id: conversationId, lastMessageSentAt };

        const roomId = GatewayUtils.getRoomIdByParticipants([initiatorId, recipient._id.toString()]);

        this.server.to(CONVERSATION_EVENTS.ROOM(roomId)).emit(STATIC_CONVERSATION_EVENTS.CREATED, newConversation);

        const initiatorSockets = this.gatewayManager.sockets.get(initiatorId);
        const recipientSockets = this.gatewayManager.sockets.get(recipient._id.toString());

        [initiatorSockets, recipientSockets].forEach((sockets) => {
            sockets?.forEach((socket) => {
                socket.emit(FEED_EVENTS.CREATE_CONVERSATION, {
                    ...newConversation,
                    recipient: socket.data.user._id.toString() === recipient._id.toString() ? initiatorSockets[0].data.user : recipient
            })
        })});
    }

    @OnEvent(STATIC_CONVERSATION_EVENTS.DELETED)
    async onConversationDeleted({ initiatorId, recipientId, conversationId }: ConversationDeleteParams) {
        const roomId = GatewayUtils.getRoomIdByParticipants([initiatorId, recipientId]);

        this.server.to(CONVERSATION_EVENTS.ROOM(roomId)).emit(STATIC_CONVERSATION_EVENTS.DELETED);

        const initiatorSockets = this.gatewayManager.sockets.get(initiatorId);
        const recipientSockets = this.gatewayManager.sockets.get(recipientId);

        [initiatorSockets, recipientSockets].forEach((sockets) => {
            sockets?.forEach((socket) => socket.emit(FEED_EVENTS.DELETE_CONVERSATION, conversationId));
        });
    }
}