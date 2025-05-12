// Badge component
interface BadgeProps {
    variant?: "default" | "outline";
    className?: string;
    children: React.ReactNode;
  }
  
  export const Badge: React.FC<BadgeProps> = ({ variant = "default", className = "", children }) => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    const variantStyles = variant === "outline" 
      ? "border border-gray-200" 
      : "bg-blue-600 text-white";
    
    return (
      <span className={`${baseStyles} ${variantStyles} ${className}`}>
        {children}
      </span>
    );
  };
  