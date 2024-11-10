import GlobalStyles from '@/components/GlobalStyles';
import AppRoutes from '@/routes/AppRoutes';
import { Typography } from '@mui/joy';
import { Suspense } from 'react';

function App() {
  return (
    <GlobalStyles>
      <Suspense fallback={<Typography level='h2'>Loading</Typography>}>
        <AppRoutes />
      </Suspense>
    </GlobalStyles>
  );
}

export default App;
