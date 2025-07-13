import { COLORS, TYPOGRAPHY } from "@/utils/designTokens";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fontFamily.primary,
      }}
    >
      <div className="text-center">
        <h1
          className="font-bold mb-4"
          style={{ fontSize: TYPOGRAPHY.fontSize["4xl"], color: COLORS.text }}
        >
          404
        </h1>
        <p
          className="mb-4"
          style={{
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: COLORS.gray[600],
          }}
        >
          Oops! Page not found
        </p>
        <a
          href="/"
          style={{
            color: COLORS.accent.primary,
            textDecoration: "underline",
            fontWeight: TYPOGRAPHY.fontWeight.bold,
          }}
          className="hover:text-blue-700"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
