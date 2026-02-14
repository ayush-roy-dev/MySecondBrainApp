
export interface ButtonProps {
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: any;
    endIcon?: any;
    onClick: () => void;
}

const defaultStyles = "rounded-md m-2 flex items-center";

const variantStyles = { 
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-400 text-purple-500"
}

const sizeStyles = {
    "sm": "py-1 px-2 text-sm",
    "md": "py-2 px-4 text-md",
    "lg": "py-4 px-6 text-lg"
}

export function Button(props: ButtonProps) {
  return (
    <button className={`${defaultStyles} ${sizeStyles[props.size]} ${variantStyles[props.variant]}`}>
        {props.startIcon? <div className="pr-2">{props.startIcon}</div> : null}
        {props.text}
        {props.endIcon? <div className="pl-2">{props.endIcon}</div> : null}
    </button>
  )
}


