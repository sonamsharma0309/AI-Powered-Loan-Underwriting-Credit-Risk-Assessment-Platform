import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// NotFound component for handling invalid routes
const NotFound = () => { 
  // Access current route location using react-router
  const location = useLocation();
// Effect hook to track invalid route access
  useEffect(() => {
    // Log error message for debugging unknown routes
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  },// Dependency array to track route changes
   [location.pathname]);

  return (
    // Root container for 404 page layout
    <div className="flex min-h-screen items-center justify-center bg-muted">
      // Centered content wrapper
      <div className="text-center">
        // Display 404 error code
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        // Error message description text
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        // Navigation link to return to home page
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
