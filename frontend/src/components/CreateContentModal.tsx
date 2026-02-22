import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./ui/Button";
import { useOutsideClick } from "../hooks/useOutsideClick";

import { Input } from "./ui/Input"

export function CreateContentModal({open, onClose}: {open: boolean, onClose: () => void}) {
    const modalRef = useOutsideClick<HTMLDivElement>(onClose);
    

    return <div>
        {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center items-center">
            <div ref={modalRef} className="flex flex-col justify-center">
                <span className="bg-white rounded opacity-100 p-4">
                    <div className="flex justify-end">
                        <div onClick={onClose} className="cursor-pointer"><CrossIcon /></div>
                    </div>
                    <div>
                        <Input placeholder="Title" onChange={() => {}}/>
                        <Input placeholder="Link" onChange={() => {}}/>
                    </div>
                    <div className="flex justify-center">
                        <Button variant="primary" text="Submit" size="md"/>
                    </div>
                </span>
            </div>
        </div>}
    </div>
}

