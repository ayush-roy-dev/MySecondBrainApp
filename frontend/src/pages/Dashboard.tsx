import { useState } from "react"
import { CreateContentModal } from "../components/CreateContentModal"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import Sidebar from "../components/Sidebar"


export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  return (<>
    <Sidebar />
    <div className="p-4 ml-72 bg-gray-100 min-h-screen border-gray-300 border-2">
      <CreateContentModal open={modalOpen} onClose={() => {setModalOpen(false)}}/>
      <div className="flex justify-end">
        <Button variant="primary" text="Add Content" size="md" startIcon={<PlusIcon size="sm"/>} onClick={() => {setModalOpen(true)}} />
        <Button variant="secondary" text="Share Brain" size="md" startIcon={<ShareIcon size="sm"/>} onClick={() => {}} />
      </div>
      
      <div className="flex mt-2">
        <Card title="Planning video" type="youtube" link="https://www.youtube.com/watch?v=PuP0jZmRaX8&list=PLoGCmkbiCMvvoUDIICSeCqgku45Kq4WrJ&index=25"/>
        <Card title="Planning article" type="youtube" link="https://x.com/ashishps_1/status/2022891700486836260"/>
      </div>
      
    </div>
    </>
  )
}

