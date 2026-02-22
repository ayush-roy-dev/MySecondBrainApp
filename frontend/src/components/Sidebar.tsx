import { LogoIcon } from "../icons/LogoIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import SidebarItem from "./SidebarItem"

function Sidebar() {
  return (
    <div className="rounded-r-xl fixed min-w-72 min-h-screen h-screen pl-6">
        <div className="flex pt-8  text-2xl font-semibold items-center">
          <div className="pr-2 text-purple-600"><LogoIcon /></div>
          Second Brain
        </div>
        <div className="pt-4 pl-3">
          <SidebarItem text="Fuck me" icon={<YoutubeIcon />} />
          <SidebarItem text="Fuck me" icon={<TwitterIcon />} /> 
        </div>
    </div>
  )
}

export default Sidebar