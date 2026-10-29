export interface ContractRecord {
  id: string;
  departmentContractNo: string;
  contractName: string;
  customerName: string;
  department: string;
  businessType: string;
  amount: number;
  contactName: string;
  contactPhone: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  source: 'seed' | 'manual' | 'import';
}

export type ContractInput = Omit<ContractRecord, 'id' | 'createdAt' | 'updatedAt'>;

export interface ContractFilters {
  keyword: string;
  department: string;
  businessType: string;
  amountRange: 'all' | 'lt100' | '100to500' | '500to1000' | 'gte1000';
  dateFrom: string;
  dateTo: string;
}
