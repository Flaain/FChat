import { HTMLAttributes } from "react";
import { ModalConfig } from "../lib/contexts/modal/types";
import { Profile } from "../lib/contexts/profile/model/types";
import { FieldError } from "react-hook-form";

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type ModalSize = "default" | "sm" | "lg" | "fit"| "fitHeight" | "screen";

export interface BaseAPI {
    baseUrl?: string;
    headers?: {
        "Content-Type"?: "application/json" | (string & object);
        Authorization?: "Bearer" | (string & object);
    };
}

export interface APIData<T> {
    data: T;
    status: Response["status"];
    statusText: Response["statusText"];
    headers: Record<string, string>;
    error?: unknown;
    message: string;
}

export interface AuthResponse extends Profile {
    accessToken: string;
    expiresIn: string | number;
}

export interface APIMethodParams<T = undefined>
    extends Partial<Omit<BaseAPI, "baseUrl">>,
        Omit<RequestInit, "headers" | "body"> {
    endpoint?: string;
    token?: string;
    body?: T;
}

export interface APIError<E> {
    error: E;
    status: number;
    headers?: Record<string, string>;
    message: string;
    type?: string;
}

export interface IMessage extends HTMLAttributes<HTMLLIElement> {
    _id: string;
    sender: Participant;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
    text: string;
    createdAt: string;
    sendingInProgress?: boolean;
}

export interface Participant {
    _id: string;
    name: string;
    email: string;
    lastSeen: string;
}

export interface Conversation {
    _id: string;
    name?: string;
    participants: Array<Participant>;
    messages: Array<IMessage>;
    creator: Participant;
    createdAt: string;
    updatedAt: string;
}

export interface ModalProps extends Omit<ModalConfig, "content"> {
    closeHandler: () => void;
    children: React.ReactNode;
}

export type TypographyVariant = "primary" | "secondary" | "commerce" | "error";
export type TypographySize = "base" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
export type TypographyAlign = "left" | "center" | "right";

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

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"];

type PropsOf<T extends React.ElementType> = React.ComponentPropsWithRef<T>;

type PolymorphicProps<T extends React.ElementType = React.ElementType, TProps = object> = {
    as?: T;
} & TProps &
    Omit<PropsOf<T>, keyof TProps | "as" | "ref"> & { ref?: PolymorphicRef<T> };

export type TypographyProps<T extends React.ElementType = "span"> = PolymorphicProps<T, BaseTypographyProps>;

export type TypographyComponent = <T extends React.ElementType = "span">(
    props: PolymorphicProps<T, TypographyProps<T>>
) => React.ReactNode;

export interface SearchUser {
    _id: string;
    name: string;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    closeHandler: () => void;
    size?: ModalSize;
}

export interface AvatarByNameProps extends React.HTMLAttributes<HTMLSpanElement> {
    name?: string;
    size?: "sm" | "md" | "lg";
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

export interface ConfirmationProps {
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    text: string;
    onConfirmText?: string;
    onCancelText?: string;
}