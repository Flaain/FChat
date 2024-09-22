import { SessionAction, SessionState, SessionTypes } from './types';

export const sessionReducer = (state: SessionState, action: SessionAction) => {
    switch (action.type) {
        case SessionTypes.AUTH_IN_PROGRESS:
            return { ...state, isAuthInProgress: action.payload.isAuthInProgress };
        case SessionTypes.AUTH:
            return {
                ...state,
                isAuthorized: true,
                userId: action.payload.userId
            };
        case SessionTypes.LOGOUT:
            return {
                ...state,
                isAuthorized: false,
                userId: null!
            };
        default:
            return state;
    }
};