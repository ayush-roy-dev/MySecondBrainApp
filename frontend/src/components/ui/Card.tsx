import { ShareIcon } from "../../icons/ShareIcon";

interface cardProps {
    title: string;
    type: "twitter" | "youtube" | "image" | "audio";
    link: string;
    
}

export function Card({title, type, link}: cardProps) {
    return <div className=" m-2 p-4 max-w-72 border-gray-200 border bg-white rounded-md ">
        <div className="flex justify-between">
            <div className="flex items-center text-md">
                <div className="pr-2 text-gray-500"><ShareIcon size="sm" /></div>
                {title}
            </div>
            <div className="flex items-center">
                <div className="text-gray-500 pr-2">
                    <a href={link} target="_blank"><ShareIcon size="sm" /></a>
                </div>
                <div className="text-gray-500"><ShareIcon size="sm" /></div>
            </div>
        </div>
        <div className="pt-4">
            {type === "youtube" && <iframe className="w-full" src={link.replace("watch", "embed")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
            {type === "twitter" && <blockquote className="twitter-tweet">
                <a href={link.replace("x.com", "twitter.com")}></a> 
            </blockquote>}
        </div>
    </div>
}