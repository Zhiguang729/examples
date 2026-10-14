import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { router } from './app/router/Routes.tsx';

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
  </StrictMode>,
)

// const theme = createTheme()

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <QueryClientProvider client={queryClient}>
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </ThemeProvider>
//   </StrictMode>
// )