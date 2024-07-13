import { IMessage } from "@/shared/model/types";

export interface MessageGroupProps {
    messages: Array<IMessage>;
    isLastGroup: boolean;
    lastMessageRef: React.RefObject<HTMLLIElement>;
}