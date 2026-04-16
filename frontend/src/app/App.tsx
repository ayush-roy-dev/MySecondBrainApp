import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';
import { DocumentProvider } from './contexts/DocumentContext';

export default function App() {
  return (
    <ThemeProvider>
      <DocumentProvider>
        <RouterProvider router={router} />
      </DocumentProvider>
    </ThemeProvider>
  );
}