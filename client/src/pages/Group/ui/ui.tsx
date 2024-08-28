import React from "react";
import { useParams } from "react-router-dom";

const Group = () => {
    const { id } = useParams<{ id: string }>(); 
    React.useEffect(() => {
        (async () => {
            const group = await fetch(`http://localhost:3000/group/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const json = await group.json();
            
            console.log(json);
        })();
    }, [])
    return (
        <div>Group</div>
    )
}

export default Group;