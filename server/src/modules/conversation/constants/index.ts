import { IAppException } from "src/utils/types";

export const createConversationWithMySelfError: Pick<IAppException, 'message'> = {
    message: 'Can not create conversation with yourself',
}

export const conversationAlreadyExistsError: Pick<IAppException, 'message'> = {
    message: 'Conversation already exists',
}

export const conversationNotFoundError: Pick<IAppException, 'message'> = {
    message: 'Conversation not found',
}