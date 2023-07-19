import { useState, useContext } from "react"
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function NewPost(props) {
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http:/localhost:8080';
    const [text, setText] = useState("")
    const {authState} = useContext(AuthContext)
    let history = useHistory()

    const addPost = () => {
        axios.post(`${baseUrl}/posts`, {
            title: props.pushups,
            text: text,
            user: authState.username
        }).then( (res) => {
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
                        width: "400px"
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