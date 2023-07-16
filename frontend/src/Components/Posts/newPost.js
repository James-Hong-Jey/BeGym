import { useState } from "react"
import axios from "axios";

export default function NewPost() {
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [user, setUser] = useState("")

    const addPost = () => {
        // axios.post("http://localhost:8080/posts", {
        axios.post("https://begym-production.up.railway.app/posts", {

            title: title,
            text: text,
            user: user
        }).then( (res) => {
            console.log("Post Uploaded");
        })
    }

    return (
        <div className="postPage"> 
            <div className="containerInput">
                <input 
                    type="text" 
                    placeholder="How many pushups?" 
                    autoComplete="off" 
                    value= {title}
                    onChange={(e)=>{setTitle(e.target.value)}}/>
                <input 
                    style={{
                        height: "200px",
                    }}
                    type="text" 
                    placeholder="Any Thoughts?" 
                    autoComplete="off" 
                    value= {text}
                    onChange={(e)=>{setText(e.target.value)}}/>
                <input 
                    type="text" 
                    placeholder="Who are you?" 
                    autoComplete="off" 
                    value= {user}
                    onChange={(e)=>{setUser(e.target.value)}}/>
                <button onClick={addPost}>Submit Post</button>
            </div>
        </div>
    )
}