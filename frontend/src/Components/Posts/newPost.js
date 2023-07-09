import { useState, useContext } from "react"
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import PoseDetector from "../Pushup-Detector/poseDetector";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function NewPost(props) {
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [user, setUser] = useState("")
    const {authState} = useContext(AuthContext)
    let history = useHistory()

    const addPost = () => {
        axios.post("http://localhost:8080/posts", {
            title: props.pushups,
            text: text,
            // user: user
            user: authState.username
        }).then( (res) => {
            // console.log("Post Uploaded");
            alert("Post Uploaded")
            history.push("/home")
        })
    }

    return (
        <div className="postPage"> 
            <div className="containerInput">
                <h1 className="pushup-count">{props.pushups}</h1>
                <input 
                    style={{
                        height: "200px",
                    }}
                    type="text" 
                    placeholder="Any Thoughts?" 
                    autoComplete="off" 
                    value= {text}
                    onChange={(e)=>{setText(e.target.value)}}/>
                
                <h3>Well done, {authState.username}</h3>
                <button onClick={addPost}>Submit Post</button>
            </div>
        </div>
    )
}
/*

                <input 
                    type="text" 
                    placeholder="How many pushups?" 
                    autoComplete="off" 
                    value= {title}
                    onChange={(e)=>{setTitle
                <input 
                    type="text" 
                    placeholder="Who are you?" 
                    autoComplete="off" 
                    value= {user}
                    onChange={(e)=>{setUser(e.target.value)}}/>(e.target.value)}}/>
                    */