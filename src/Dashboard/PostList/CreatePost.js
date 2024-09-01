import './postlist.css';
import { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function Createpost({id,username,postList,setPostList, setLoadingPage, getPostsByPage}) {
    const textAreaRef = useRef(null);

    async function CreatepostClicked(event) {
        event.preventDefault();
        if(textAreaRef.current.value.length > 0) {
            setLoadingPage(0);
            const data = {
                createdBy: id,
                createdOn: new Date(),
                postContent: textAreaRef.current.value
            }
            try {
                await axios.post('http://localhost:5000/createPost',data);
                await getPostsByPage(1);
            }
            catch(error) {
                toast.error("error sending data to server.")
            }
            finally {
                textAreaRef.current.value = "";
                setLoadingPage(1);
            }
        }
        else toast.error('Enter text to create a post!',{
            duration: 1000
        });
    }

    return (
        <>
            <form className="dashboard-createpost" onSubmit={CreatepostClicked}>
                <textarea ref={textAreaRef} className='dashboard-textarea' rows={5} cols={100} placeholder='Create a Post!' maxLength={500}></textarea>

                <input type='submit' className='dashboard-post-button' onClick={CreatepostClicked} value="Post"/>
            </form>
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