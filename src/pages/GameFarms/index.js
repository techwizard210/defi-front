import { Grid } from '@material-ui/core';
import moonVaultLogo from '../../assets/img/MoonVaultLogo.png';
import MoonvaultVaultWrapper from '../../components/MoonVault/MoonvaultVaultWrapper';

const GameFarms = () => {
  const config = {
    compatibleVaults: [23],
    defaultChain: 56,
    cdnPath: 'http://dev.moon-vault.com/',
    showBreakevenPanel: false,
    debugMode: false,
  };

  return (
    <>
      <div className="vaultsHeading">Vaults</div>
      <MoonvaultVaultWrapper config={config} />
      <Grid container>
        <Grid item lg={7} md={9} sm={8} xs={7} />
        <Grid item lg={3} md={3} sm={4} xs={5}>
          <a
            href="https://app.moon-vault.com/vaults"
            target="_blank"
            rel="noreferrer"
          >
            <div className="moonVaultLinkWrapper">
              Powered by Moon Vault
              <img
                className="moonVaultImage"
                src={moonVaultLogo}
                alt="Moon Vault Logo"
              />
            </div>
          </a>
        </Grid>
        <Grid item lg={3} />
      </Grid>

      <div className="gameFarmsHeading">Game Farms</div>
      <div className="gameFarmsComingSoon">Coming soon!</div>
    </>
  );
};

export default GameFarms;
