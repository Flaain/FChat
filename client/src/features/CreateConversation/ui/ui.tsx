import Container from './Container';
import { CreateConversationProvider } from '../model/provider';

const CreateConversation = () => (
    <CreateConversationProvider>
        <Container />
    </CreateConversationProvider>
);

export default CreateConversation;