import Navbar from "./navbar.homepage.js";
import HomepageNotSignedIn from "./main.homepage.js";
import HomepageNSIFooter from "./footer.homepage.js";

export default function Homepage() {  
    return (
        <div>
            <Navbar/>
            <HomepageNotSignedIn/>
            <HomepageNSIFooter/>
        </div>
    )
}