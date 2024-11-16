import GlobalStyles from '@/components/GlobalStyles';
import AppRoutes from '@/routes/AppRoutes';
import { Typography } from '@mui/joy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

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
