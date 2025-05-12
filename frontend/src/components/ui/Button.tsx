// Button component
interface ButtonProps {
    variant?: "default" | "outline";
    size?: "default" | "sm";
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }
  
  export const Button: React.FC<ButtonProps> = ({ 
    variant = "default", 
    size = "default", 
    className = "", 
    children, 
    disabled = false,
    onClick
  }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantStyles = variant === "outline" 
      ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" 
      : "bg-blue-600 text-white hover:bg-blue-700";
      
    const sizeStyles = size === "sm"
      ? "h-9 px-3 text-xs"
      : "h-10 px-4 py-2 text-sm";
    
    return (
      <button 
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };