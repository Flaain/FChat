import { getImageUrl } from "@/shared/lib/utils/getImageUrl";

const Home = () => {
    return (
        <div className='flex flex-col flex-1 items-center justify-center dark:bg-dark-conversation-panel bg-primary-white'>
            <h1 className='dark:text-primary-white text-primary-dark-100 text-2xl font-bold'>
                Select a chat to start messaging
            </h1>
            <img src={getImageUrl("chat.svg")} alt='chat icon' />
        </div>
    );
};

export default Home;