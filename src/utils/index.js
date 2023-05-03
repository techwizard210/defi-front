import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { JSBI, Percent } from '@pancakeswap/sdk';
import { BASE_BSC_SCAN_URL } from '../config';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getBscScanLink(data, type, chainId) {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URL[chainId]}/tx/${data}`;
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URL[chainId]}/token/${data}`;
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URL[chainId]}/block/${data}`;
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URL[chainId]}/block/countdown/${data}`;
    }
    default: {
      return `${BASE_BSC_SCAN_URL[chainId]}/address/${data}`;
    }
  }
}

// add 10%
export function calculateGasMargin(value) {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num) {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
