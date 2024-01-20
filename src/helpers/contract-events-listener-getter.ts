import ContractGetterBase from '@/helpers/contract-getter-base';
import { ethers, WebSocketProvider } from 'ethers';

const { PRIVATE_KEY, WEBSOCKET_RPC_URL } = process.env;

class ContractEventsListenerGetter extends ContractGetterBase {
  getContract() {
    const provider = new WebSocketProvider(WEBSOCKET_RPC_URL!);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contractABI = this.getABIFromJSONFile(this.contractABIPath);
    return new ethers.Contract(this.contractAddress, contractABI, wallet);
  }
}

export default ContractEventsListenerGetter;
