import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import "../../App.css"

export default function PostFeed() {

    const [postsList, setPostsList] = useState([]);
    const history = useHistory()

    useEffect( () => {
        // axios.get("http://localhost:8080/posts").then((response) => {
        axios.get("https://begym-production.up.railway.app/posts").then((response) => {
            // console.log(response.data);
            setPostsList(response.data);
        })
    }, [])

    return (
        <div className="feed">
            {postsList.map((value, key) => {
                return (
                    <div className="posts" onClick={()=>{history.push(`/post/${value.id}`)}}> 
                        <div className="title"> {value.title} </div>
                        <div className="user"> {value.user} </div>
                    </div>
                );
            })}
        </div>
    );
}