import { useActiveSessions } from "../lib/hooks/useActiveSessions";

const ActiveSessions = () => {
    const sessions = useActiveSessions();
    return <div>{sessions.length ? 'active sessions' :  'wtf?'}</div>;
};

export default ActiveSessions;