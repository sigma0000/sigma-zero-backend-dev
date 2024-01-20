import ContractGetterBase from '@/helpers/contract-getter-base';
import { ethers } from 'ethers';

class ContractService {
  private contract: ethers.Contract;

  constructor(contractGetter: ContractGetterBase) {
    this.contract = contractGetter.getContract();
  }

  getContract() {
    return this.contract;
  }

  async setBetValue(betIndex: number, value: number) {
    const tx = await this.contract.setBetValue(betIndex, value);
    await tx.wait();
  }

  async voidBet(betIndex: number) {
    const tx = await this.contract.voidBet(betIndex);
    await tx.wait();
  }

  async closeBet(betIndex: number) {
    const tx = await this.contract.closeBet(betIndex);
    await tx.wait();
  }

  async calculateResultsAndDistributeWinnings(betIndex: number, value: number) {
    const tx = await this.contract.calculateResultsAndDistributeWinnings(
      betIndex,
      value,
    );
    await tx.wait();
  }
}

export default ContractService;
