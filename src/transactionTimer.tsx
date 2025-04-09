import React, { useState } from 'react';
import { Contract, TransactionResponse } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

interface TransactionTimerProps {
  contract: Contract;
  provider: Provider; // Pass provider explicitly as a prop
}

const TransactionTimer: React.FC<TransactionTimerProps> = ({ contract, provider }) => {
  const [txTime, setTxTime] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendTransaction = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setTxTime(null);

    try {
      // 1. Capture the start time
      const startTime = performance.now();

      // 2. Send the transaction.
      // Replace "myMethod" and its arguments as needed.
      const tx: TransactionResponse = await contract.myMethod(/* your arguments here */);
      const afterSendTime = performance.now();
      console.log(`Time to send transaction = ${afterSendTime - startTime} ms`);

      // 3. Wait for the transaction to be mined using the explicitly passed provider.
      const receipt: TransactionReceipt = await provider.waitForTransaction(tx.hash);

      // 4. Capture the end time once the transaction is confirmed.
      const endTime = performance.now();
      const duration = endTime - startTime;
      setTxTime(duration);
      console.log(`Transaction confirmed in ${duration} ms`, receipt);
    } catch (error: any) {
      console.error('Transaction failed:', error);
      setErrorMessage(error.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Transaction Timer (ethers.js v6)</h2>
      <button onClick={handleSendTransaction} disabled={isLoading}>
        {isLoading ? 'Transaction in progress...' : 'Send Transaction'}
      </button>
      {txTime !== null && <p>Transaction took {txTime.toFixed(2)} ms</p>}
      {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
    </div>
  );
};

export default TransactionTimer;
