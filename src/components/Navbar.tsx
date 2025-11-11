import { Link } from "react-router-dom";
import { useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import './Navbar.css';

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-logo">FINANCE BUDGETING</div>
      
      <div className="navbar-right">
        {/* Show for signed-out users */}
        <SignedOut>
          <Link to="/sign-in" className="nav-btn">Sign In</Link>
          <Link to="/sign-up" className="nav-btn">Sign Up</Link>
        </SignedOut>

        {/* Show for signed-in users */}
        <SignedIn>
          <span className="user-name">Hello, {user?.firstName || user?.fullName || 'User'}</span>
          <SignOutButton>
            <button className="nav-btn signout-btn">Sign Out</button>
          </SignOutButton>
        </SignedIn>
      </div>
    </nav>
  );
}
