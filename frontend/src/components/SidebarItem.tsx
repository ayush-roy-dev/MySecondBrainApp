import type { ReactElement } from "react"

function SidebarItem({text, icon}: {text: string, icon: ReactElement}) {
  return (
    <div className="flex items-center text-xl py-4 pl-4 cursor-pointer hover:bg-gray-200 rounded max-w-48 transition-all duration-150">
        <div className="mr-2 text-red">{icon}</div> 
        <div>{text}</div>
    </div>
  )
}

export default SidebarItem