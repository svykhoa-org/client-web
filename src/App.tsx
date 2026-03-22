import { RouterProvider } from 'react-router';

import '@ant-design/v5-patch-for-react-19';

import { LayoutProvider } from '@/contexts';
import { ThemeProvider } from '@/contexts/theme';
import { TanstackProvider } from '@/lib/tanstack-query';
import router from '@/routes';

function App() {
  return (
    <TanstackProvider>
      <ThemeProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </ThemeProvider>
    </TanstackProvider>
  );
}

export default App;
