export function Input({onChange, placeholder}: {onChange: () => void, placeholder: string}) {
    return <div>
        <input type="text" placeholder={placeholder} className="border m-2 px-4 py-2" onChange={onChange} />
    </div>
}