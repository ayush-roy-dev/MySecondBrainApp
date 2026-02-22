import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Signup() {
    return (
        <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl border-gray-500 min-w-48 p-8 ">
                <Input placeholder="username" onChange={() => {}}/>
                <Input placeholder="password" onChange={() => {}}/>
                <div className="flex justify-center">
                    <Button loading={false} variant="primary" size="full" text="Signup"/>
                </div>
            </div>
        </div>
    )
}