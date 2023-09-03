export default function NewPost(props) {
    return (
        <div className="postPage"> 
            <div className="containerInput">
                <h1 className="pushup-count">{props.pushups}</h1>
                <h3>Well done!</h3>
            </div>
        </div>
    )
}