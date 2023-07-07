import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "react-router-dom"

export default function Post() {
    let { id } = useParams();
    const [postObj, setPostObj] = useState({})
    const [postComments, setPostComments] = useState([])
    const [newComment, setNewComment] = useState("")

    useEffect( () => {
        axios.get(`http://localhost:8080/posts/postID/${id}`).then((response) => {
            setPostObj(response.data)
        })
    }, []);

    useEffect( () => {
        axios.get(`http://localhost:8080/comments/${id}`).then((response) => {
            setPostComments(response.data)
            console.log(response.data)
        })
    }, []);

    const addComment = () => {
        axios
        .post("http://localhost:8080/comments", {
            commentBody: newComment,
            PostId: id,
        }, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken")
            }
        })
        .then( (res) => {
            if(res.data.error) {
                console.log(res.data.error)
            } else {
                // "manually" adds the comment to the end so
                // user doesn't have to reload to see, then clear
                console.log("Comment Uploaded");
                const theNewComment = {commentBody: newComment}
                setPostComments( [...postComments, theNewComment])
                setNewComment("")
            }
        })
    }

    return (
        <div className="postPage"> 
            <div className="leftSide">
                <div className="posts" style={{ position: "absolute", top: "70px"}}>
                    <div className="title"> {postObj.title} </div>
                    <div className="text"> {postObj.text} </div>
                    <div className="user"> {postObj.user} </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="containerInput">
                    <input 
                        type="text" 
                        placeholder="Write a comment!" 
                        autoComplete="off" 
                        value= {newComment}
                        onChange={(e)=>{setNewComment(e.target.value)}}/>
                    <button onClick={addComment}>Submit Comment</button>
                </div>
                <div className="commentsList">
                    {postComments.map( (comment, key) => {
                        return (
                            <div key={key} className="comment"> {comment.commentBody} </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )

}