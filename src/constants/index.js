import ERC20ABI from '../contracts/HIFIToken.json';
import GAMEFACTORYABI from '../contracts/GameFactory.json';

export const FactoryAddress = '0xF6C48fb39Cd9D21E5103b1F01b26C6B2cEB2c1C7';
export const NFTStakingAddress = '0xfEE371B90149130691265934ba0127bee0f8ED22'; // '0xF415DCB63C9Da4b74758C6EC70242c12228E7616';
export const IntoTheHifiverseNFTContract =
  '0x3E8bb868753357be4492958A8f63dfa29432996D';
export const TokenAddress = '0x0A38bc18022b0cCB043F7b730B354d554C6230F1';
export const MINIMUM_BALANCE_FOR_EARN = 1000;
export const ANALYTICS_ID = 'UA-204966145-1';
export const ITEM_PRICE = [10000, 5000, 2000];

export const Networks = {
  BSC: 56,
  BSCTestnet: 97,
};

export const TOKENS_BY_NETWORK = {
  [Networks.BSC]: [
    {
      address: '0x0A38bc18022b0cCB043F7b730B354d554C6230F1',
      name: 'HiFi Token',
      symbol: 'HIFI',
      decimals: 18,
      abi: ERC20ABI.result,
    },
  ],
  [Networks.BSCTestnet]: [
    {
      address: '0xefad4c0b50dc4089bb354979ae2cad9e41c3606b',
      name: 'HiFi Token',
      symbol: 'HIFI',
      decimals: 18,
      abi: ERC20ABI.result,
    },
  ],
};

export const FACTORY_BY_NETWORK = {
  [Networks.BSC]: [
    {
      address: '0xF6C48fb39Cd9D21E5103b1F01b26C6B2cEB2c1C7',
      abi: GAMEFACTORYABI.result,
    },
  ],
  [Networks.BSCTestnet]: [
    {
      address: '0x189196d1F2D3781486878389D0Bfc56b06790287',
      abi: GAMEFACTORYABI.result,
    },
  ],
};

export const INSTRUCTION_LINK =
  'https://hifigamingsociety.medium.com/how-to-play-games-on-hifi-gaming-society-1150e5df31b0';
export const DISCORD_LINK = 'https://discord.gg/agDmDC4wcp';
export const TELEGRAM_LINK = 'https://t.me/HiFiGamingSocietyPlatform';

export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5009/'
    : 'https://staging-admin.hifigamingsociety.org/';

export const BoostEnabled = true;
