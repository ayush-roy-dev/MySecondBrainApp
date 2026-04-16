import { NoteWriter } from '../components/NoteWriter';
import { GraphView } from '../components/GraphView';
import { AIChat } from '../components/AIChat';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../components/ui/resizable';

export function NewNotePage() {
  return (
    <ResizablePanelGroup direction="vertical">
      {/* Top Section: Note Writer and Graph View */}
      <ResizablePanel defaultSize={65} minSize={30}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <NoteWriter />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <GraphView />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Bottom Section: AI Chat */}
      <ResizablePanel defaultSize={35} minSize={20}>
        <AIChat />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
