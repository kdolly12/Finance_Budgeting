import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  ClerkLoaded,
  ClerkLoading,
  useAuth,
} from "@clerk/clerk-react";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import { SavingsProvider } from "./context/SavingsProvider";
import Loader from "./components/Loader";

function RootRoute() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait until Clerk finishes loading the user
  if (!isLoaded) return <Loader />;

  // Redirect signed-in users to dashboard
  if (isSignedIn) return <Navigate to="/dashboard" replace />;

  // Otherwise show landing page
  return <LandingPage />;
}

export default function App() {
  return (
    <SavingsProvider>
      {/* Show loader while Clerk is initializing */}
      <ClerkLoading>
        <Loader />
      </ClerkLoading>

      <ClerkLoaded>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Navbar />
                  <Dashboard />
                </SignedIn>

                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ClerkLoaded>
    </SavingsProvider>
  );
}
