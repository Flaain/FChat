import { ModalConfig } from '../lib/contexts/modal/types';
import { Profile, User } from '../lib/contexts/profile/model/types';
import { FieldError } from 'react-hook-form';

export enum FeedTypes {
    CONVERSATION = 'conversation',
    GROUP = 'group',
    USER = 'user'
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type ModalSize = 'default' | 'sm' | 'lg' | 'fit' | 'fitHeight' | 'screen';
export type MessageFormState = 'send' | 'edit';

export interface BaseAPI {
    baseUrl?: string;
    headers?: {
        'Content-Type'?: 'application/json' | (string & object);
        Authorization?: 'Bearer' | (string & object);
    };
}

export interface APIData<T> {
    data: T;
    status: Response['status'];
    statusText: Response['statusText'];
    headers: Record<string, string>;
    error?: unknown;
    message: string;
}

export interface AuthResponse extends Profile {
    accessToken: string;
    expiresIn: string | number;
}

export interface APIMethodParams<T = undefined> extends Partial<Omit<BaseAPI, 'baseUrl'>>,  Omit<RequestInit, 'headers' | 'body'> {
    endpoint?: string;
    token?: string;
    body?: T;
}

export interface APIError<E> {
    error: E;
    statusCode: number;
    headers?: Record<string, string>;
    message: string;
    type?: string;
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
    isVerified?: boolean;
}

export interface ConversationParticipant extends Pick<User, '_id' | 'isVerified' | 'email' | 'name' | 'lastSeenAt' | 'isPrivate'> {}

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
    isVerified?: boolean;
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
    isVerified?: boolean;
    type: FeedTypes.USER;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    closeHandler: () => void;
    size?: ModalSize;
}

export interface AvatarByNameProps extends React.HTMLAttributes<HTMLSpanElement> {
    name?: string;
    size?: 'sm' | 'md' | 'lg';
}

export type FormErrorsType = [
    string,
    (
        | FieldError
        | (Record<
              string,
              Partial<{
                  type: string | number;
                  message: string;
              }>
          > &
              Partial<{
                  type: string | number;
                  message: string;
              }>)
    )
];

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

export type GroupFeed = Pick<Group, '_id' | 'lastMessage' | 'lastMessageSentAt' | 'isVerified' | 'name'> & {
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
    LEFT = 'conversation.left',
    CREATED = 'conversation.created',
    MESSAGE_SEND = 'conversation.message.send',
    MESSAGE_EDIT = 'conversation.message.edit',
    MESSAGE_DELETE = 'conversation.message.delete',
}

export enum FEED_EVENTS {
    NEW_MESSAGE = 'feed.new.message',
    EDIT_MESSAGE = 'feed.edit.message',
    DELETE_MESSAGE = 'feed.delete.message',
    NEW_CONVERSATION = 'feed.new.conversation'
}

export interface GetConversationsRes {
    conversations: Array<Omit<ConversationFeed, 'type' | 'recipient'> & { participants: Array<ConversationParticipant> }>;
    nextCursor: string;
}

export type ScrollTriggeredFromTypes = "init" | "infiniteScroll" | "send"