import OutletDetailsButton from '@/shared/ui/OutletDetailsButton';
import { ConversationParticipant, OutletDetailsTypes } from '@/shared/model/types';

const RecipientDetails = ({ recipient }: { recipient: ConversationParticipant }) => (
    <div className='flex flex-col'>
        {recipient.status && <OutletDetailsButton data={recipient.status} type={OutletDetailsTypes.BIO} />}
        <OutletDetailsButton data={recipient.login} type={OutletDetailsTypes.LOGIN} />
        <OutletDetailsButton data={recipient.email} type={OutletDetailsTypes.EMAIL} />
    </div>
);

export default RecipientDetails;