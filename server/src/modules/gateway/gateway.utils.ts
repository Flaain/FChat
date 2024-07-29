export class GatewayUtils {
    static getRoomIdByParticipants(participants: Array<string>, seperator: string = '-') {
        return participants.sort().join(seperator);
    }
}