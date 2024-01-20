import ContractGetterBase from '@/helpers/contract-getter-base';
import { ethers, JsonRpcProvider } from 'ethers';

const { PRIVATE_KEY, RPC_URL } = process.env;

class ContractGetter extends ContractGetterBase {
  getContract() {
    const provider = new JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contractABI = this.getABIFromJSONFile(this.contractABIPath);

    return new ethers.Contract(this.contractAddress, contractABI, wallet);
  }
}

export default ContractGetter;
