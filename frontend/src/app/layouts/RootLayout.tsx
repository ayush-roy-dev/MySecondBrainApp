import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { GlobalDragOverlay } from "../components/GlobalDragOverlay";
import { Toaster } from "../components/ui/sonner";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../components/ui/resizable";

export function RootLayout() {
  return (
    <div className="h-screen flex flex-col">
      <GlobalDragOverlay />
      <Toaster />
      <ResizablePanelGroup direction="horizontal">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Sidebar />
        </ResizablePanel>

        <ResizableHandle />

        {/* Main Content Area */}
        <ResizablePanel defaultSize={80}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}