import Container from './Container';
import { CreateGroupProvider } from '../model/provider';

const CreateGroup = () => (
    <CreateGroupProvider>
        <Container />
    </CreateGroupProvider>
);

export default CreateGroup;