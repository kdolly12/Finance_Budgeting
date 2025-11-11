import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import './LandingPage.css';

export default function LandingPage() {
  const [modalType, setModalType] = useState<"signIn" | "signUp" | null>(null);

  const closeModal = () => setModalType(null);

  return (
    <div className="landing-container">
      <h1>WELCOME TO PERSONAL FINANCE COACH</h1>
      <p>Manage your finances effortlessly</p>

      <div className="flex gap-4">
        <button onClick={() => setModalType("signIn")}>Sign In</button>
        <button onClick={() => setModalType("signUp")}>Sign Up</button>
      </div>

      {modalType === "signIn" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>
            <SignIn
              signUpUrl="/"
              afterSignInUrl="/dashboard"
            />
          </div>
        </div>
      )}

      {modalType === "signUp" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>
            <SignUp
              signInUrl="/"
              afterSignUpUrl="/dashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
}
