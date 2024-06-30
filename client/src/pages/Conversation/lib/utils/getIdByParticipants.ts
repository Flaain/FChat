export const getIdByParticipants = ({
    participants,
    seperator = '-'
}: {
    participants: string[];
    seperator?: string;
}) => participants.sort().join(seperator);