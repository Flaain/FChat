export class GatewayUtils {
    static getRoomIdByParticipants = (participants: Array<string>, seperator: string = '-') => participants.sort().join(seperator);
}
