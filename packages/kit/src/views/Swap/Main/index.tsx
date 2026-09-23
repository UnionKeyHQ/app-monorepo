import { SwapButtonProgressContext } from '../context';
import { useProgressStatusContext } from '../hooks/useSwapUtils';

import { SwapMain } from './Swap';

export function Main() {
  const swapContext = useProgressStatusContext();
  return (
    <SwapButtonProgressContext.Provider value={swapContext}>
      <SwapMain />
    </SwapButtonProgressContext.Provider>
  );
}
