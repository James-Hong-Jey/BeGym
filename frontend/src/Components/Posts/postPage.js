import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "react-router-dom"

export default function Post() {
    let { id } = useParams();
    const [postObj, setPostObj] = useState({})

    useEffect( () => {
        axios.get(`http://localhost:8080/posts/postID/${id}`).then((response) => {
            setPostObj(response.data)
        })
    }, []);

    return (
        <div className="posts" style={{height: "400px"}}> 
            <div className="title"> {postObj.title} </div>
            <div className="text"> {postObj.text} </div>
            <div className="user"> {postObj.user} </div>
        </div>
    )

}