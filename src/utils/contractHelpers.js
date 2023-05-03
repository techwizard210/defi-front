import { ethers } from 'ethers';
import { simpleRpcProvider } from './providers';

// ABI

import bep20Abi from '../contracts/erc20.json';
import erc721Abi from '../contracts/erc721.json';

const getContract = (abi, address, signer) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (address, signer) => {
  return getContract(bep20Abi, address, signer);
};
export const getErc721Contract = (address, signer) => {
  return getContract(erc721Abi, address, signer);
};
