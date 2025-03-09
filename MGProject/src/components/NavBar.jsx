import { Link } from "react-router-dom";
import '../css/NavBar.css';

const NavBar = () => {
    return (
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/create-post">Create Post</Link>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default NavBar;