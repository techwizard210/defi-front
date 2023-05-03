import { useEffect, useState } from 'react';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import { Carousel } from 'react-responsive-carousel';
import { v4 as uuid_v4 } from 'uuid';
import clsx from 'clsx';
import { useWeb3React } from '@web3-react/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay, Mousewheel } from 'swiper/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  SportsEsports as SportsEsportsIcon,
} from '@material-ui/icons';

import { History } from '../theme';
import GameItem from '../components/GameItem';

import { walletAuthFetchWithSigPrompt } from '../helpers/apiFetchWrappers';

import useStyles from '../assets/styles';

import newGameBanner from '../assets/img/carousel/newGameBanner.png';
import APRBanner from '../assets/img/carousel/APRBanner.png';

const BrowseGame = (props) => {
  const classes = useStyles.browseGame();
  const backdrops = useStyles.backdrop();

  const { wipeSignatureAndReRequest } = props;

  const { account, chainId } = useWeb3React();

  const [filterGames, setFilterGames] = useState([]);

  const [sliceCount, setSliceCount] = useState(8);
  const [isLoading, setLoading] = useState(false);

  SwiperCore.use([Navigation, Autoplay, Mousewheel]);

  const handleCloseBackdrop = () => {
    setLoading(false);
  };

  const ActiveGame = (item) => {
    const id = item.id ?? item.bundleUrl;
    History.push(`/play-game/${id}`);
  };

  const goToPage = (page) => {
    History.push(`/${page}`);
  };

  useEffect(() => {
    const fetchAPIGames = async () => {
      try {
        const resp = await walletAuthFetchWithSigPrompt(
          `GameManagement?mobile=${isMobile}`,
          'GET',
          wipeSignatureAndReRequest,
          account,
          null,
          true,
          null
        );
        const apiGamesToShow = resp;

        setFilterGames(apiGamesToShow);
      } catch (error) {
        console.log('failed to fetch games');
      }
    };
    fetchAPIGames();
  }, [account, chainId, wipeSignatureAndReRequest]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const wWidth = window.innerWidth;
      if (wWidth >= 1300) {
        setSliceCount(8);
      } else if (wWidth < 1300 && wWidth >= 1000) {
        setSliceCount(6);
      } else if (wWidth < 1000 && wWidth >= 800) {
        setSliceCount(4);
      } else if (wWidth < 800 && wWidth >= 700) {
        setSliceCount(2);
      }
    });
  }, [account]);

  const swiperMove = (target) => {
    if (target === 'left') {
      for (
        let i = 0;
        i < document.getElementsByClassName('swiper-button-prev').length;
        i += 1
      ) {
        document.getElementsByClassName('swiper-button-prev')[i].click();
      }
    } else {
      for (
        let i = 0;
        i < document.getElementsByClassName('swiper-button-next').length;
        i += 1
      ) {
        document.getElementsByClassName('swiper-button-next')[i].click();
      }
    }
  };

  const DesktopBrowseGameList = () => {
    return (
      <Grid container spacing={2}>
        <Grid container item xs={12} spacing={2}>
          <Grid item lg={4} md={6} xs={12}>
            <Grid
              className={clsx(
                classes.gameCarouselOption,
                'recommendCarouselAnimation'
              )}
            >
              <Grid className={classes.swiperContent}>
                <h2 className={classes.recommendGames}>Recommended Games</h2>
                <Grid className={classes.featuredSlider}>
                  <KeyboardArrowLeftIcon
                    onClick={() => swiperMove('left')}
                    className={clsx(classes.prevButton, 'prevButton')}
                  />
                  <KeyboardArrowRightIcon
                    onClick={() => swiperMove('right')}
                    className={clsx(classes.nextButton, 'nextButton')}
                  />
                  <Swiper
                    navigation
                    className={clsx(classes.mySwiper, 'mySwiper')}
                    mousewheel={false}
                    preventInteractionOnTransition
                    loop
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                  >
                    {filterGames.slice(0, 5).map((item) => (
                      <SwiperSlide key={uuid_v4()}>
                        <GameItem item={item} ActiveGame={ActiveGame} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Grid>
                <Grid className={classes.featSwiperBg}>
                  <Swiper
                    navigation
                    loop
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                  >
                    {filterGames.slice(0, 8).map((item) => (
                      <SwiperSlide key={uuid_v4()}>
                        <Grid className={classes.gameOverlay}>
                          <SportsEsportsIcon
                            className={classes.gameOverlayIcon}
                          />
                        </Grid>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${item.img}`}
                          alt={item.title}
                          className={clsx(
                            classes.gameImage,
                            classes.recommendImage,
                            classes.backImage
                          )}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <Grid container spacing={isMobile === true ? 0 : 2}>
              {filterGames.slice(0, sliceCount).map((item) => (
                <Grid
                  item
                  lg={3}
                  sm={6}
                  xs={12}
                  key={uuid_v4()}
                  className={classes.perGameContainer}
                >
                  <GameItem item={item} ActiveGame={ActiveGame} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={2} className={classes.marginZero}>
          {filterGames.slice(8).map((item) => (
            <Grid
              item
              lg={2}
              sm={3}
              xs={isMobile === true ? 6 : 12}
              key={uuid_v4()}
              className={classes.perGameContainer}
            >
              <GameItem item={item} ActiveGame={ActiveGame} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  };

  const MobileBrowseGameList = () => {
    return (
      <Grid container item xs={12} spacing={2} className={classes.marginZero}>
        {filterGames &&
          filterGames.map((item) => (
            <Grid
              item
              lg={2}
              sm={3}
              xs={isMobile === true ? 6 : 12}
              key={uuid_v4()}
              className={classes.perGameContainer}
            >
              <GameItem item={item} ActiveGame={ActiveGame} />
            </Grid>
          ))}
        {!filterGames ||
          (filterGames.length === 0 && (
            <Grid
              item
              lg={2}
              sm={3}
              xs={isMobile === true ? 6 : 12}
              key={uuid_v4()}
              className={classes.perGameContainer}
            >
              No games found...
            </Grid>
          ))}
      </Grid>
    );
  };

  return (
    <>
      <BrowserView>
        <Box>
          <Grid container className={classes.gameHeaderSection}>
            <Grid container item lg={12} xs={12}>
              <Carousel
                showThumbs={false}
                showArrows={false}
                stopOnHover={false}
                interval={8000}
                infiniteLoop
                emulateTouch
                autoPlay
                className="customCarouselRoot"
              >
                <div className="newGamesBanner">
                  <img
                    alt="img1"
                    src={newGameBanner}
                    className="carouselImage"
                  />
                  <div className="newGamesWrapper">
                    <Grid container>
                      <Grid item lg={3} md={3} xs={3} />
                      <Grid item lg={9} md={9} xs={9}>
                        <Grid container spacing={3}>
                          <Grid
                            item
                            lg={2}
                            sm={2}
                            xs={2}
                            key={uuid_v4()}
                            className="bannerGameWrapper"
                          />
                          {filterGames.slice(0, 3).map((item) => (
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={3}
                              xs={3}
                              key={uuid_v4()}
                              className="bannerGameWrapper"
                            >
                              <GameItem item={item} ActiveGame={ActiveGame} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div
                  role="button"
                  tabIndex="0"
                  onClick={() => goToPage('stake-rewards')}
                >
                  <img
                    alt="aprBanner"
                    src={APRBanner}
                    className="carouselImage"
                  />
                </div>
              </Carousel>
            </Grid>
          </Grid>
          <Grid container className={classes.mGameHeaderSection}>
            <div
              className={classes.pageAlert}
              role="button"
              tabIndex="0"
              onClick={() => goToPage('dashboard')}
            >
              The new earnings model is now live! Head over to the profile page
              to view your active missions!
            </div>
          </Grid>
          <Grid container className={classes.gameListSection}>
            <DesktopBrowseGameList />
          </Grid>
        </Box>
        <Backdrop
          className={backdrops.backdrop}
          open={isLoading}
          onClick={handleCloseBackdrop}
          style={{ zIndex: 999999 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </BrowserView>
      <MobileView>
        <Box>
          <Grid container className={classes.mGameHeaderSection}>
            <Grid container item lg={6} xs={12}>
              <Carousel
                showThumbs={false}
                showArrows={false}
                stopOnHover={false}
                interval={8000}
                infiniteLoop
                emulateTouch
                autoPlay
                className="mCustomCarouselRoot"
              >
                <div className="newGamesBanner">
                  <img
                    alt="img1"
                    src={newGameBanner}
                    className="carouselImage"
                  />
                  <div className="newGamesWrapper">
                    <Grid container>
                      <Grid item lg={3} md={3} xs={3} />
                      <Grid item lg={9} md={9} xs={9}>
                        <Grid container spacing={3}>
                          <Grid
                            item
                            lg={2}
                            sm={2}
                            xs={2}
                            key={uuid_v4()}
                            className="bannerGameWrapper"
                          />
                          {filterGames.slice(0, 3).map((item) => (
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={3}
                              xs={3}
                              key={uuid_v4()}
                              className="bannerGameWrapper"
                              onClick={() => ActiveGame(item)}
                            >
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${item.img}`}
                                alt="newGames"
                                onClick={() => ActiveGame(item)}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div
                  role="button"
                  tabIndex="0"
                  onClick={() => goToPage('stake-rewards')}
                >
                  <img
                    alt="aprBanner"
                    src={APRBanner}
                    className="carouselImage"
                  />
                </div>
              </Carousel>
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.mGameHeaderSection}
            justifyContent="center"
            alignItems="center"
          >
            <div
              className={classes.pageAlert}
              role="button"
              tabIndex="0"
              onClick={() => goToPage('dashboard')}
            >
              The new earnings model is now live! Head over to the profile page
              to view your active missions!
            </div>
          </Grid>
          <Grid container className={classes.mGameHeaderSection}>
            <MobileBrowseGameList />
          </Grid>
        </Box>
        <Backdrop
          className={backdrops.backdrop}
          open={isLoading}
          onClick={handleCloseBackdrop}
          style={{ zIndex: 999999 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </MobileView>
    </>
  );
};

export default BrowseGame;
