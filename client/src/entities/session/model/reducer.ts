import { SessionAction, SessionState, SessionTypes } from './types';

export const sessionReducer = (state: SessionState, action: SessionAction) => {
    switch (action.type) {
        case SessionTypes.SET_IS_AUTH_IN_PROGRESS:
            return { ...state, isAuthInProgress: action.payload.isAuthInProgress };
        case SessionTypes.SET_ON_AUTH:
            return {
                ...state,
                isAuthorized: true,
                userId: action.payload.userId
            };
        case SessionTypes.SET_ON_LOGOUT:
            return {
                ...state,
                isAuthorized: false,
                userId: undefined
            };
        default:
            return state;
    }
};