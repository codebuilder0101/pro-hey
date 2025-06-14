import { createTrackedSelector } from "react-tracked";
import type { Address } from "viem";
import { create } from "zustand";

export interface FundingToken {
  contractAddress: Address;
  symbol: string;
}

interface TopUpAmount {
  showFundModal: boolean;
  token?: FundingToken;
  amountToTopUp?: number;
}

interface State {
  showFundModal: boolean;
  token?: FundingToken;
  amountToTopUp?: number;
  setShowFundModal: ({
    showFundModal,
    token,
    amountToTopUp
  }: TopUpAmount) => void;
}

const store = create<State>((set) => ({
  showFundModal: false,
  token: undefined,
  amountToTopUp: undefined,
  setShowFundModal: ({ showFundModal, token, amountToTopUp }) =>
    set(() => ({ showFundModal, token, amountToTopUp }))
}));

export const useFundModalStore = createTrackedSelector(store);
