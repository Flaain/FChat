export const CONVERSATION_EVENTS = {
    conversation: 'conversation',

    ROOM(id: string) {
        return `${this.conversation}:${id}`;
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
};