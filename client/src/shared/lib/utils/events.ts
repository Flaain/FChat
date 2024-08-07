export const CONVERSATION_EVENTS = {
    MAIN: 'conversation',

    get conversation() {
        return this.MAIN;
    },

    ROOM(id: string) {
        return `${this.conversation}:${id}`;
    },

    JOIN() {
        return `join.${this.conversation}`;
    },

    LEAVE() {
        return `leave.${this.conversation}`;
    },

    MESSAGE_SEND(id: string) {
        return `${this.conversation}:${id}:send.message`;
    },

    MESSAGE_EDIT(id: string) {
        return `${this.conversation}:${id}:edit.message`;
    },

    JOIN_ERROR(id: string) {
        return `${this.JOIN}:${id}:error`;
    },

    CONVERSATION_CREATE(id: string) {
        return `${this.conversation}:${id}:create`;
    }
};