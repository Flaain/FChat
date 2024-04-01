import { useProfile } from "@/shared/lib/hooks/useProfile";

const Home = () => {
    const { profile } = useProfile();
    
    console.log(profile);

    return <div>Home</div>;
};

export default Home;