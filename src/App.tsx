import GlobalStyles from '@/components/GlobalStyles';
import { default as LoadingOverlay } from '@/components/PageOverlay';
import { queryClient } from '@/configs/tanstackQuery.config';
import AppRoutes from '@/routes/AppRoutes';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles>
        <Suspense fallback={<LoadingOverlay />}>
          <AppRoutes />
        </Suspense>
      </GlobalStyles>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
