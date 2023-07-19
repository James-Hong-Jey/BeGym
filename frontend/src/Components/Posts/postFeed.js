import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import "../../App.css"

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function PostFeed() {
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http:/localhost:8080';
    const [postsList, setPostsList] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const history = useHistory()

    useEffect(() => {
        axios.get(`${baseUrl}/posts`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((response) => {
            setPostsList(response.data.postsList);
            setLikedPosts(response.data.likedPosts.map((like) => {
                return like.PostId
            }));
        })
    }, [])

    const likePost = (id) => {
        axios.post(`${baseUrl}/likes`,
            { PostId: id },
            { headers: { accessToken: localStorage.getItem("accessToken") } })
            .then((response) => {
                // alert(response.data)
                const liked = response.data.liked
                setPostsList(postsList.map((post) => {
                    if (post.id === id) {
                         // artificially adding 0 to the likes array so the number goes up
                         if (liked) {
                             return { ...post, Likes: [...post.Likes, 0] }
                         } else {
                             const likeArray = post.Likes
                             likeArray.pop()
                             return { ...post, Likes: likeArray }
                         }
                    } else {
                        return post
                    }
                }))
                if(likedPosts.includes(id)) {
                    setLikedPosts(likedPosts.filter((postId) => { return postId !== id}))
                } else {
                    setLikedPosts( [...likedPosts, id])
                }
            })
    }

    return (
        <div className="feed">
            {postsList.map((value, key) => {
                return (
                    <div className="posts" >
                        <div className="title" onClick={() => { history.push(`/post/${value.id}`) }}> {value.title} </div>
                        <div className="user">
                            <div className="user-username"> {value.user}{" "}</div>
                            <div className="likecontainer">
                                {!likedPosts.includes(value.id) ?
                                    <ThumbUpIcon className="like"
                                        onClick={() => {
                                            likePost(value.id)
                                        }} />
                                    :
                                    <ThumbDownIcon className="like"
                                        onClick={() => {
                                            likePost(value.id)
                                        }} />
                                }
                                <label>{value.Likes.length}</label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}