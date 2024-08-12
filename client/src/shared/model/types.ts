import { Session } from '@/entities/session/model/types';
import { ModalConfig } from '../lib/contexts/modal/types';
import { User } from '../lib/contexts/profile/types';

export enum FeedTypes {
    CONVERSATION = 'conversation',
    GROUP = 'group',
    USER = 'user'
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithParams<T = Record<string, unknown>> = T & { params?: RequestParams };
export type ModalSize = 'default' | 'sm' | 'lg' | 'fit' | 'fitHeight' | 'screen';
export type MessageFormState = 'send' | 'edit';

export interface BasicAPIResponse {
    status: number;
    message: string;
}

export interface RequestParams {
    cursor: string;
}

export interface BaseAPI {
    baseUrl?: string;
    credentials?: RequestCredentials;
    headers?: {
        'Content-Type'?: 'application/json' | (string & object);
        Authorization?: 'Bearer' | (string & object);
    };
}

export interface APIData<T> {
    data: T;
    statusCode: Response['status'];
    headers: Record<string, string>;
    message: string;
}

export enum AppExceptionCode {
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    FORM = 'FORM'
}

export interface IAppException {
    message: string;
    url: string;
    statusCode: number;
    timestamp: Date;
    headers: Record<string, string>;
    errors?: Array<{ path: string; message: string }>;
    errorCode?: AppExceptionCode;
}

export interface IMessage {
    _id: string;
    sender: ConversationParticipant;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
    text: string;
    createdAt: string;
    updatedAt: string;
    sendingInProgress?: boolean;
}

export interface GroupParticipant {
    _id: string;
    name: string;
    email: string;
    userId: string;
}

export interface ConversationParticipant extends Pick<User, '_id' | 'isOfficial' | 'email' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'presence'> {}

export interface Conversation {
    _id: string;
    recipient: ConversationParticipant;
    messages: Array<IMessage>;
    lastMessage?: IMessage;
    lastMessageSentAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface Group {
    _id: string;
    name: string;
    participants: Array<GroupParticipant>;
    isOfficial?: boolean;
    messages: Array<IMessage>;
    lastMessage?: IMessage;
    lastMessageSentAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface ModalProps extends Omit<ModalConfig, 'content'> {
    closeHandler: () => void;
    children: React.ReactNode;
}

export interface SheetProps {
    children: React.ReactNode;
    closeHandler: () => void;
    withHeader?: boolean;
    direction?: 'left' | 'right';
    title?: string;
}

export type TypographyVariant = 'primary' | 'secondary' | 'commerce' | 'error';
export type TypographySize = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TypographyAlign = 'left' | 'center' | 'right';

export interface TypographyVariants {
    variant: Record<TypographyVariant, string>;
    size: Record<TypographySize, string>;
    weight: Record<TypographyWeight, string>;
}

interface BaseTypographyProps {
    variant?: TypographyVariant;
    size?: TypographySize;
    weight?: TypographyWeight;
    align?: TypographyAlign;
}

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

type PropsOf<T extends React.ElementType> = React.ComponentPropsWithRef<T>;

type PolymorphicProps<T extends React.ElementType = React.ElementType, TProps = object> = {
    as?: T;
} & TProps &
    Omit<PropsOf<T>, keyof TProps | 'as' | 'ref'> & { ref?: PolymorphicRef<T> };

export type TypographyProps<T extends React.ElementType = 'span'> = PolymorphicProps<T, BaseTypographyProps>;

export type TypographyComponent = <T extends React.ElementType = 'span'>(
    props: PolymorphicProps<T, TypographyProps<T>>
) => React.ReactNode;

export interface SearchUser {
    _id: string;
    name: string;
    isOfficial: boolean;
    presence: PRESENCE;
    login: string;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    closeHandler: () => void;
    size?: ModalSize;
}

export interface AvatarByNameProps extends React.HTMLAttributes<HTMLSpanElement> {
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    isOnline?: boolean;
}

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
    callback: () => Promise<void> | void;
    deps: React.DependencyList;
}

export interface Meta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export type Feed = Array<ConversationFeed | GroupFeed | UserFeed>;

export type FeedItem = ConversationFeed | GroupFeed | UserFeed;

export type ConversationFeed = Pick<Conversation, '_id' | 'lastMessage' | 'lastMessageSentAt' | 'recipient'> & {
    type: FeedTypes.CONVERSATION;
};

export type GroupFeed = Pick<Group, '_id' | 'lastMessage' | 'lastMessageSentAt' | 'isOfficial' | 'name'> & {
    type: FeedTypes.GROUP;
};

export type UserFeed = SearchUser & { type: FeedTypes.USER };

export interface Drafts {
    value: string;
    state: MessageFormState;
    selectedMessage?: IMessage;
}

export enum CONVERSATION_EVENTS {
    JOIN = 'conversation.join',
    LEAVE = 'conversation.leave',
    CREATED = 'conversation.created',
    DELETED = 'conversation.deleted',
    MESSAGE_SEND = 'conversation.message.send',
    MESSAGE_EDIT = 'conversation.message.edit',
    MESSAGE_DELETE = 'conversation.message.delete',
    USER_PRESENCE = 'conversation.user.presence',
}

export enum FEED_EVENTS {
    CREATE_MESSAGE = 'feed.create.message',
    EDIT_MESSAGE = 'feed.edit.message',
    DELETE_MESSAGE = 'feed.delete.message',
    CREATE_CONVERSATION = 'feed.create.conversation',
    DELETE_CONVERSATION = 'feed.delete.conversation',
    USER_ONLINE = 'feed.user.online',
    USER_OFFLINE = 'feed.user.offline'
}

export enum USER_EVENTS {
    PRESENCE = 'user.presence',
    ONLINE = 'user.online',
    OFFLINE = 'user.offline',
}

export enum PRESENCE {
    ONLINE = 'online',
    OFFLINE = 'offline',
}

export interface GetConversationsRes {
    conversations: Array<
        Omit<ConversationFeed, 'type' | 'recipient'> & { participants: Array<ConversationParticipant> }
    >;
    nextCursor: string;
}

export interface DeleteMessageEventParams {
    lastMessage: IMessage;
    lastMessageSentAt: string;
    conversationId: string;
}

export enum UserCheckType {
    EMAIL = 'email',
    LOGIN = 'login'
}

export type UserCheckParams =
    | { type: UserCheckType.EMAIL; email: string }
    | { type: UserCheckType.LOGIN; login: string };

export enum ActionPasswordType {
    SET = 'set',
    CHECK = 'check'
}

export type UserPasswordParams =
    | { type: ActionPasswordType.SET; currentPassword: string; newPassword: string }
    | { type: ActionPasswordType.CHECK; currentPassword: string };

export interface GetConversation {
    conversation: Pick<Conversation, '_id' | 'recipient' | 'messages' | 'createdAt'>;
    nextCursor: string;
}

export interface DeleteMessageRes {
    isLastMessage: boolean;
    lastMessage: IMessage;
    lastMessageSentAt: string;
}

export interface GetSessionsReturn {
    currentSession: {
        _id: string;
        userAgent: ParsedSession;
        createdAt: string;
        expiresAt: string;
    };
    sessions: Array<Session>;
}

export interface ParsedSession {
    ua: string;
    browser: IBrowser;
    device: IDevice;
    engine: IEngine;
    os: IOS;
    cpu: ICPU;
}

export interface IBrowser {
    name: string | undefined;
    version: string | undefined;
    major: string | undefined;
}

export interface IDevice {
    model: string | undefined;
    type: string | undefined;
    vendor: string | undefined;
}

export interface IEngine {
    name: string | undefined;
    version: string | undefined;
}

export interface IOS {
    name: string | undefined;
    version: string | undefined;
}

export interface ICPU {
    architecture: string | undefined;
}