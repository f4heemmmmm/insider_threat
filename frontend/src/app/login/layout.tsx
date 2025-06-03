// frontend/src/app/login/layout.tsx

interface LoginLayoutProps {
    children: React.ReactNode;
}

/**
 * LoginLayout component that provides the base layout structure for authentication pages.
 * 
 * This layout component:
 * - Establishes the foundational styling for login-related pages
 * - Provides a consistent background and minimum height for full-screen coverage
 * - Serves as a wrapper for login, registration, or password reset pages
 * - Maintains visual consistency across all authentication flows
 * 
 * The layout uses a light gray background to create a subtle contrast
 * with the login form components and ensures proper visual hierarchy.
 */
export default function LoginLayout({ children }: LoginLayoutProps) {
    return (
        <div className = "min-h-screen bg-gray-50">
            {children}
        </div>
    );
};