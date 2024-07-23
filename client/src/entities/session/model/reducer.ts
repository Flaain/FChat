import { SessionAction, SessionState, SessionTypes } from './types';

export const sessionReducer = (state: SessionState, { type, payload }: SessionAction) => {
    switch (type) {
        case SessionTypes.SET_IS_AUTH_IN_PROGRESS:
            return { ...state, isAuthInProgress: payload.isAuthInProgress };
        case SessionTypes.SET_ON_AUTH:
            return {
                ...state,
                isAuthorized: payload.isAuthorized,
                userId: payload.userId
            };
        case SessionTypes.SET_ON_LOGOUT:
            return {
                ...state,
                isAuthorized: payload.isAuthorized,
                userId: undefined
            };
        default:
            return state;
    }
};