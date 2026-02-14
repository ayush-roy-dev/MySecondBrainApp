import { Button } from "./components/ui/Button"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"


function App() {

  return (
    <>
      {/* <Button variant="primary" size="lg" text="Click me" onClick={() => {}}></Button> */}
      <Button variant="primary" text="Share" size="sm" startIcon={<PlusIcon size="sm"/>} onClick={() => {}} />
      <Button variant="secondary" text="Add Content" size="lg" startIcon={<ShareIcon size="lg"/>} onClick={() => {}} />
      <Button variant="primary" text="Add Content" size="md" startIcon={<PlusIcon size="md"/>} onClick={() => {}} />
    </>
  )
}

export default App
