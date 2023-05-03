// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import promoImg from '../assets/img/comingSoonHiFiLogo.png';

const ComingSoon = () => {
  // ** Define Maintainers
  return (
    <>
      <div className="comingSoon">Coming Soon</div>
      <Container id="app-signin" component="main" maxWidth="xs">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <div className="paper">
            <div className="promo-img mt-50">
              <img src={promoImg} alt="" />
            </div>
          </div>
        </Grid>
      </Container>
    </>
  );
};

export default ComingSoon;
