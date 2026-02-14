
const sizeStyles = {
    "sm": "size-4",
    "md": "size-5",
    "lg": "size-6"
}

export function PlusIcon({ size }: { size: "sm" | "md" | "lg" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={sizeStyles[size]}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    )
}


