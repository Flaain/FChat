export const getIdByParticipants = ({
    participants,
    seperator = '-'
}: {
    participants: Array<string>;
    seperator?: string;
}) => participants.sort().join(seperator);