import { Contract } from 'ethers';
import fs from 'fs';

abstract class ContractGetterBase {
  protected contractAddress: string;
  protected contractABIPath: string;

  constructor(contractAddress: string, contractABIPath: string) {
    this.contractAddress = contractAddress;
    this.contractABIPath = contractABIPath;
  }

  abstract getContract(): Contract;

  protected getABIFromJSONFile(contractABIPath: string) {
    try {
      const contractABI = fs.readFileSync(contractABIPath, 'utf-8');
      const contractABIJSON = JSON.parse(contractABI);

      return contractABIJSON.abi;
    } catch (error) {
      //eslint-disable-next-line no-console
      console.log('Error reading contract ABI from JSON file:', error);
      throw error;
    }
  }
}

export default ContractGetterBase;
