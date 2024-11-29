import GlobalStyles from '@/components/GlobalStyles';
import { queryClient } from '@/configs/tanstackQuery.config';
import AppRoutes from '@/routes/AppRoutes';
import { Typography } from '@mui/joy';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles>
        <Suspense fallback={<Typography level='h2'>Loading</Typography>}>
          <AppRoutes />
        </Suspense>
      </GlobalStyles>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
