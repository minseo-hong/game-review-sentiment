import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import GameDetail from './pages/GameDetail';

dayjs.locale('ko');

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameDetail />
    </QueryClientProvider>
  );
}

export default App;
