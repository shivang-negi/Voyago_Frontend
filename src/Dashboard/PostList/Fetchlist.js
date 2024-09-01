import { useEffect } from 'react';
import './postlist.css';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

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

export default function Fetchlist({id,postList,setPostList,loadingPage,footerList, getPostsByPage}) {

    useEffect(()=>{
        getPostsByPage(1);
    },[]);
    let navigate = useNavigate();

    async function footerPress(index) {
        console.log(index);
        await getPostsByPage(index);
    }

    async function favorite(obj) {
        let updatedList = postList.map((item) => {
            if (item._id === obj._id) {
                return { ...item, favorite: obj.favorite === 1 ? 0 : 1 }; 
            }
            return item;
        });
    
        if (obj.favorite === 1) {
            await axios.post('http://localhost:5000/unlikePost/', { userId: id, postId: obj._id });
        } else {
            await axios.post('http://localhost:5000/likePost/', { userId: id, postId: obj._id });
        }
    
        setPostList(updatedList);
    }

    function comment(id) {
        navigate(`/post/${id}`);
    }

    if(loadingPage === 0) return <SyncLoader 
        color='#36d7b7'
        size={25} 
        margin={3} 
        className='postLoader'/>;

    return (
        <>
            <div className='fetchlist-container'>
                <div className='fetchlist-heading'>Posts from other people</div>
                {
                    postList.map((obj)=> {
                        return <div className='user-post' key={obj._id}>

                                <div className='user-name-stamp'>
                                    <div className='user-post-name'>{obj.createdBy.username}</div>
                                    <div className='user-timestamp'>{timeAgo(obj.createdOn)}</div>
                                </div>
                                <div className='user-post-content'>{obj.postContent}</div>
                                <button className='user-favorite' onClick={()=>{favorite(obj)}}>
                                    {(obj.favorite === 1)?<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" style={{color:"#c71426"}}/>
          </svg>:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
        <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" style={{color:"#c71426"}}/>
        </svg>}
                                </button>

                                <button className='user-favorite' 
                                onClick={()=>comment(obj._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat-right-dots" viewBox="0 0 16 16">
                                    <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                </button>
                            </div>;
                    })
                }
            </div>

            <div className='page_navigation'>

                {
                    footerList.map((value,index) => {
                        return <button className="footer-but" key={index} onClick={()=>{footerPress(index+1)}}>{value}</button>;
                    })
                }
            </div>
            
            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        fontFamily: 'Arial, sans-serif'
                    },
                }}
            />
        </>
    )
}