import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './post.css';
import toast, { Toaster } from 'react-hot-toast';
import { SyncLoader } from "react-spinners";

export default function Post() {

    let navigate = useNavigate();
    const [username,setUsername] = useState(null);
    const { postId } = useParams();
    const [postData, setPostData] = useState(null);
    const [replyVisible, setReplyVisible] = useState(null);
    const [commentList, setCommentList] = useState(-1);
    const [commentNumber, setCommentNumber] = useState(0);

    function setVisibilityForReply(commentId) {
        setReplyVisible(replyVisible === commentId ? null : commentId);
    }

    const commentRef = useRef(null);

    function back() {
        return (
            <button className="backButtonPost" onClick={()=>{navigate('/')}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                </svg>
                <div>Go Back</div>
            </button>
        )
    }

    useEffect(()=>{
        async function getData() {
            const response = await axios.post('http://localhost:5000/getPost/', {
                postId: postId
            });
            if(response.data.status === 1) setPostData(response.data.message);
            else toast.error("error fetching data from server.");

            const user = localStorage.getItem('id');
            setUsername(user);
        }       
        
        async function getComments() {
            const response = await axios.post('http://localhost:5000/getComments/',{
                postId: postId
            });

            if(response.data.status === 1) setCommentList(response.data.message);
            else toast.error("error fetching data from server.");

            const commentResponse = response.data.comments;
            let commentData = [];
            let num = 0;

            commentResponse.forEach((x)=>{
                commentData.push({
                    username: x.userId.username,
                    commentRef: x.commentRef,
                    comment: x.comment,
                    commentId: x._id,
                    timestamp: x.createdOn
                });
                num++;
            });

            const result = [];
            const commentMap = new Map();
            

            commentData.forEach(comment => {
                comment.commentReplies = [];
                commentMap.set(comment.commentId, comment);
            });
            
            commentData.forEach(comment => {
                if (comment.commentRef === null) {
                    result.push(comment);
                } else {
                    const parentComment = commentMap.get(comment.commentRef);
                    if (parentComment) {
                        parentComment.commentReplies.push(comment);
                    }
                }
            });

            result.reverse();

            setCommentNumber(num);
            setCommentList(result);
            console.log(commentData);
        }

        getData()
        .then(async ()=>{
            getComments()
        });
        
    },[]);

    if(postData === null) return (
        <SyncLoader 
            color='#e3e9f7'
            size={25} 
            margin={3} 
            className='postLoader'/>
    )

    async function submitComment(e) {
        if(commentRef.current.value.length === 0) {
            toast.error("Enter text to submit comment!", {duration: 1000});
            return;
        }

        const response = await axios.post('http://localhost:5000/createComment/', {
            postId: postId,
            userId: username,
            comment: commentRef.current.value,
            commentRef: null
        });
        if(response.data.status === 0) toast.error("error sending data to server");
        console.log("Comment created: " + commentRef.current.value);
        commentRef.current.value = "";
        console.log(response);
    }

    function displayComments() {
        if(commentList === -1) {
            return  <SyncLoader 
            color='#e3e9f7'
            size={25} 
            margin={3} 
            className='postLoader'/>
        }
        else {
            return (
                <div className="comments">
                    <div className="comment-heading">Comments({commentNumber})</div>
                    <div className="comment-list">
                        {
                            commentList.map((comment)=>(
                                <div key={comment.commentId} style={{marginBottom:'3%'}}>
                                    <Comment key={comment.commentId} 
                                        comment={comment} 
                                        replyVisible={replyVisible} 
                                        setVisibilityForReply={setVisibilityForReply}
                                        postId={postId}
                                        userId={postData.createdBy._id}
                                        username={username}>
                                    </Comment>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="ContainerForPost">
            {/* <div>{JSON.stringify(postData)}</div> */}
            <div className="post">
                <div className="post-user">{postData.createdBy.username}</div>
                <div className="post-timestamp">{timeAgo(postData.createdOn)}</div>
                <div className="post-content">{postData.postContent}</div>

                {/* Create Comment */}
                <form className="create-comment" onSubmit={submitComment}>
                    <textarea ref={commentRef} className='comment-textarea' rows={3} cols={100} placeholder='Post your comment!' maxLength={500}></textarea>
                    <input type='submit' className='comment-post-button' value="Create Comment"/>
                </form>


                
                {/* Comment Section */}
                {displayComments()}

            </div>
            {back()}
            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        fontFamily: 'Arial, sans-serif'
                    },
                }}
            />
        </div>
    )
}

function Comment({comment, marginLeft = 0, replyVisible, setVisibilityForReply, postId, userId, username}) {

    const replyRef = useRef(null);

    function createReply() {
        setVisibilityForReply(comment.commentId);
    }

    async function submitReply(e) {
        if(replyRef.current.value.length === 0) {
            toast.error("Enter text to submit reply.",{duration: 1000});
            return;
        }

        const response = await axios.post('http://localhost:5000/createComment/', {
            postId: postId,
            userId: username,
            comment: replyRef.current.value,
            commentRef: comment.commentId
        });

        if(response.data.status === 0) toast.error("error sending data to server");
        replyRef.current.value = ""; 
    }

    return (
        <div style={{marginLeft: `${marginLeft*20}px`}}>
            <span className="comment-username-p">{comment.username}</span>
            <span className="comment-timestamp">{timeAgo(comment.timestamp)}</span>
            <div className="comment-content-p">{comment.comment}</div>
            <span className="comment-reply" onClick={createReply}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply" viewBox="0 0 16 16">
                <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z"/>
                </svg>
            </span>
            
            <form className="create-comment" onSubmit={submitReply} style={{display: (replyVisible === comment.commentId)?"flex":"none"}}>
                <textarea ref={replyRef} className='comment-textarea' placeholder='Post your comment!' maxLength={500}></textarea>
                <input type='submit' className='comment-post-button' value="Reply"/>
            </form>
            {
                comment.commentReplies.length > 0 && comment.commentReplies.map((comment)=>(
                    <Comment 
                        key={comment.commentId} 
                        comment={comment} 
                        marginLeft={marginLeft+1}
                        replyVisible={replyVisible} 
                        setVisibilityForReply={setVisibilityForReply}
                        postId={postId}
                        userId={userId}
                        username={username}
                    ></Comment>
                ))
            }
            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        fontFamily: 'Arial, sans-serif'
                    },
                }}
            />
        </div>
    )
}

const timeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return `Just now`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 29030400) return `${Math.floor(diffInSeconds / 2419200)} months ago`;
    return `${Math.floor(diffInSeconds / 29030400)} years ago`;
};