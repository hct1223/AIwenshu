import React, { createContext, useContext, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { ContractRecord } from '../types/contract.ts';
import { buildSeedContracts, migrateContractRecords } from '../data/contractData.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';

interface ContractContextValue {
  contracts: ContractRecord[];
  setContracts: Dispatch<SetStateAction<ContractRecord[]>>;
}

const INITIAL_CONTRACTS = buildSeedContracts();
const ContractContext = createContext<ContractContextValue | null>(null);

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = usePersistentState<ContractRecord[]>(
    'saibao.contracts',
    INITIAL_CONTRACTS,
    {
      version: 2,
      migrate: migrateContractRecords,
      validate: Array.isArray,
    }
  );

  return (
    <ContractContext.Provider value={{ contracts, setContracts }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContracts(): ContractContextValue {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContracts 必须在 ContractProvider 内使用');
  }
  return context;
}
