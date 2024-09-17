import { FeedAPI } from './feedAPI';
import { GroupAPI } from './groupAPI';

export const api = {
    feed: new FeedAPI(),
    group: new GroupAPI(),
};