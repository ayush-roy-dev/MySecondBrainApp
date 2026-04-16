import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface DocumentContextType {
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
}

const DocumentContext = createContext<
  DocumentContextType | undefined
>(undefined);

export function DocumentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pendingFile, setPendingFile] = useState<File | null>(
    null,
  );
  const [documentName, setDocumentName] = useState<string>("");

  return (
    <DocumentContext.Provider
      value={{
        pendingFile,
        setPendingFile,
        documentName,
        setDocumentName,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error(
      "useDocument must be used within a DocumentProvider",
    );
  }
  return context;
}