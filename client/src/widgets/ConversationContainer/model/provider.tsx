import React from 'react';
import { ConversationContainerContext } from './context';
import { ContainerConversationState, ContainerConversationTypes, ConversationContainerProviderProps } from './types';
import { containerReducer } from './reducer';
import { useParams } from 'react-router-dom';

const initialState: ContainerConversationState = {
    value: '',
    selectedMessage: null,
    formState: 'send'
};

export const ConversationContainerProvider = ({ children, defaultState }: ConversationContainerProviderProps) => {
    const { id } = useParams();
    const [state, dispatch] = React.useReducer(containerReducer, { ...initialState, ...defaultState });

    const value = React.useMemo(() => ({ dispatch, state }), [dispatch, state]);

    React.useEffect(() => {
        dispatch({ 
            type: ContainerConversationTypes.SET_CLOSE, 
            payload: { value: '', selectedMessage: null, formState: "send" } 
        });
    }, [id]);

    return <ConversationContainerContext.Provider value={value}>{children}</ConversationContainerContext.Provider>;
};