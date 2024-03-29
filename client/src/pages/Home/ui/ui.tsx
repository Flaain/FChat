import { selectSessionSlice } from "@/entities/session/model/slice";
import { useAppSelector } from "@/shared/model/hooks";

const Home = () => {
    const profile = useAppSelector(selectSessionSlice);
    console.log(profile);
    return <div>Home</div>;
}

export default Home;