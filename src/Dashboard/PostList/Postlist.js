import { useState } from 'react';
import Createpost from './CreatePost';
import Fetchlist from './Fetchlist';
import axios from 'axios';
import './postlist.css';
import toast from 'react-hot-toast';

export default function Postlist({id,username}) {

    const [postList, setPostList] = useState([]);
    const [loadingPage, setLoadingPage] = useState(0);
    const [footerList, setFooterList] = useState([]);

    async function getPostsByPage(page_no) {
        setLoadingPage(0);

        const data = {
            id: id
        }

        const res = await axios.post('http://localhost:5000/findAll/' + page_no, data);
        if(res.data.status != 1) {
            toast.error("Error retrieving data from server.");
        }
        let totalPosts = (res.data.message.postCount);
        let postData = (res.data.message.posts);
        let favPost = (res.data.message.favorite);

        for(let i=0;i<postData.length;i++) {
            let favorite = 0;
            for(let j=0;j<favPost.length;j++) {
                if(postData[i]._id === favPost[j].id) favorite = favPost[j].favorite;
            }
            postData[i]["favorite"] = favorite;
        }

        setPostList(postData);
        setLoadingPage(1);

        let arr = [];
        let end = Math.trunc(totalPosts/5) + ((totalPosts%5)>0?1:0)
        for(let i=1;i<=end;i++) arr.push(i);

        setFooterList(arr);
    }

    return (
        <div className='postlist-container'>

            <Createpost id={id} username={username} postList={postList} setPostList={setPostList}
                setLoadingPage={setLoadingPage} getPostsByPage={getPostsByPage}
            />
            
            <Fetchlist id={id} username={username} postList={postList} setPostList={setPostList} loadingPage={loadingPage} 
                footerList={footerList} getPostsByPage={getPostsByPage}
            />
        
        </div>
    ) 
}