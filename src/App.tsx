import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router';
import { MatchProvider } from './providers/MatchProvider';

const queryClient = new QueryClient()
// First fix
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MatchProvider>
        <Router />
      </MatchProvider>
    </QueryClientProvider>
  )
}

export default App
