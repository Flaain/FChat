import React from 'react';
import { Session } from '../../model/types';

export const useActiveSessions = () => {
    const [sessions, setSessions] = React.useState<Array<Session>>([]);

    React.useEffect(() => {}, []);

    return sessions
};