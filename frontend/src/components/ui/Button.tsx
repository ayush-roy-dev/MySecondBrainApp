
export interface ButtonProps {
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg" | "full";
    text: string;
    startIcon?: any;
    endIcon?: any;
    onClick: () => void;
    loading?: boolean;
}

const defaultStyles = "rounded-md m-2 flex items-center cursor-pointer hover:rounded-0 ";

const variantStyles = { 
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-200 text-purple-600"
}

const sizeStyles = {
    "sm": "py-1 px-2 text-sm",
    "md": "py-2 px-4 text-md",
    "lg": "py-4 px-6 text-lg",
    "full": "text-md w-full py-2 px-4 flex justify-center"
}

export function Button(props: ButtonProps) {
  return (
    <button disabled={props.loading} onClick={props.onClick} className={`${defaultStyles} ${sizeStyles[props.size]} ${variantStyles[props.variant]} ${props.loading? "opacity-45": ""}`}>
        {props.startIcon? <div className="pr-2">{props.startIcon}</div> : null}
        {props.text}
        {props.endIcon? <div className="pl-2">{props.endIcon}</div> : null}
    </button>
  )
}


