import './homepage.css';
import { Link } from 'react-router-dom';

export default function HomepageNotSignedIn() {

    return (

        <div className="homepage-not-signedin">
            <div className='homepage-n-background'>

                <div className='h-n-b-texts'>
                    <span className='h-n-b-text'>Plan your next event with us!</span>
                    <p className='h-n-b-text'>Built for the voyages of today and tomorrow</p>
                    <p className='h-n-b-text'>
                        Everything you need to craft impactful experiences all while staying technologically relevant, now and always.
                    </p>
                    <div className='h-n-b-buttons'>

                        <Link to='/signup'>
                            <button className='h-n-b-button1'>
                                SIGN UP FOR FREE
                            </button>
                        </Link>

                        <Link to='/login'>
                            <button className='h-n-b-button2'>
                                LOGIN
                            </button>
                        </Link>
                        
                    </div>
                </div>

                <div className='h-n-b-video'>
                    <div className='video'>
                        <img src='tenor.gif' className='section1-gif' draggable='false'></img>
                    </div>
                </div>

            </div>

            <div className='homepage-nsi-section2'>
                <span className='homepage-nsi-s2-text'>The simplest way to plan all your trips</span>
                <div className='homepage-nsi-s2-cards'>
                    <div className='homepage-nsi-card'>
                        <div className='homepage-nsi-card-text1'>In-person Events</div>
                        <div className='homepage-nsi-card-text2'>Keep it all together at the venue</div>
                        <button className="homepage-nsi-card-btn">
                            <span className="homepage-nsi-card-btn-text">
                                Explore More
                            </span>
                        </button>
                        <div className='homepage-nsi-card-gif'>
                            <img src='typing.gif' className='section2-gif' draggable='false'></img>
                        </div>
                    </div>

                    <div className='homepage-nsi-card'>
                        <div className='homepage-nsi-card-text1'>Virtual Events</div>
                        <div className='homepage-nsi-card-text2'>Go beyond webinars and workshops</div>
                        <button className="homepage-nsi-card-btn">
                            <span className="homepage-nsi-card-btn-text">
                                Explore More
                            </span>
                        </button>
                        <div className='homepage-nsi-card-gif'>
                            <img src='call.gif' className='section2-gif' draggable='false'></img>
                        </div>
                    </div>

                    <div className='homepage-nsi-card'>
                        <div className='homepage-nsi-card-text1'>Hybrid Events</div>
                        <div className='homepage-nsi-card-text2'>Merge the physical with virtual</div>
                        <button className="homepage-nsi-card-btn">
                            <span className="homepage-nsi-card-btn-text">
                                Explore More
                            </span>
                        </button>
                        <div className='homepage-nsi-card-gif'>
                            <img src='monkey.gif' className='section2-gif' draggable='false'></img>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
} 