import './footer.css';

export default function HomepageNSIFooter() {
    return (
        <footer className="homepage_nsi_footer">
            <div className="homepage_nsi_footer_heading">
                Plan your events smarter, better and efficiently.
            </div>

            <form className='homepage_nsi_footer_search'>
                
                <input type='text' placeholder='Seach for product overview, FAQs and more...' className='homepage_nsi_footer_searchbar'></input>
                <button type='submit' className='homepage_nsi_footer_searchbtn'>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </button>
            </form>

            <ul className='homepage_nsi_footer_list'>
                <li className='homepage_nsi_footer_list_item'>
                    <a href='/' className='homepage_nsi_footer_list_link'>Home</a>
                </li>
                <li className='homepage_nsi_footer_list_item'>
                    <a href='/' className='homepage_nsi_footer_list_link'>Contact Us</a>
                </li>
                <li className='homepage_nsi_footer_list_item'>
                    <a href='/' className='homepage_nsi_footer_list_link'>Terms of Services</a>
                </li>
                <li className='homepage_nsi_footer_list_item'>
                    <a href='/' className='homepage_nsi_footer_list_link'>Cookie Policy</a>
                </li>
                <li className='homepage_nsi_footer_list_item'>
                    <a href='/' className='homepage_nsi_footer_list_link'>Help</a>
                </li>
            </ul>
        </footer>
    )
}