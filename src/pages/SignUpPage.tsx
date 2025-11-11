import { SignUp } from "@clerk/clerk-react";
import "./Auth.css";

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          layout: { socialButtonsVariant: "iconButton" },
        }}
      />
    </div>
  );
}
