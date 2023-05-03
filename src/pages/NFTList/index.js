import { useEffect, useState, useCallback } from 'react';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import { v4 as uuid_v4 } from 'uuid';
import { useWeb3React } from '@web3-react/core';
import SwiperCore, { Navigation, Autoplay, Mousewheel } from 'swiper/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { CardActionArea } from '@material-ui/core';
import { History } from '../../theme';

import useStyles from '../../assets/styles';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import Input from './Input';
import CheckboxInput from './CheckboxInput';
import MultiSelectCheckbox from './MultiSelect';

import nftKeyImg from '../../assets/img/nftKey.png';
import MobileFilters from './MobileFilters';

const initialFormState = {
  Name: null,
  MinLevel: null,
  MaxLevel: null,
  CurrentScholarsMin: null,
  CurrentScholarsMax: null,
  MinTotalScholars: null,
  MaxTotalScholars: null,
  OnlyOwned: false,
  OrderByField: null,
  OrderByDirection: null,
  ResultsPerPage: 20,
  PageNo: 1,
  SelectedTiers: [],
};

const sortingOptions = [
  { Name: 'GamingNft.Tier', Direction: 'asc', Label: 'Highest Tier' },
  { Name: 'GamingNft.Tier', Direction: 'desc', Label: 'Lowest Tier' },
  { Name: 'GamingNft.Level', Direction: 'desc', Label: 'Highest Level' },
  { Name: 'GamingNft.Level', Direction: 'asc', Label: 'Lowest Level' },
  {
    Name: 'GamingNft.NumSlots',
    Direction: 'desc',
    Label: 'Highest Scholars',
  },
  {
    Name: 'GamingNft.NumSlots',
    Direction: 'asc',
    Label: 'Lowest Scholars',
  },
];

const NFTList = (props) => {
  const classes = useStyles.browseGame();
  const backdrops = useStyles.backdrop();

  const { wipeSignatureAndReRequest } = props;

  const { account, chainId } = useWeb3React();

  const [nfts, setNFTs] = useState(null);
  const [order, setOrder] = useState(sortingOptions[0]);

  const [isLoading, setLoading] = useState(false);

  SwiperCore.use([Navigation, Autoplay, Mousewheel]);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [nftQuery, setNFTQuery] = useState(initialFormState);

  const setInput = (newValue) => {
    // eslint-disable-next-line no-shadow
    setNFTQuery((nftQuery) => ({ ...nftQuery, ...newValue }));
  };

  const clearFilters = () => {
    setNFTQuery(initialFormState);
  };

  const handleChangeSort = (event) => {
    const localOrder = event.target.value;
    setOrder(localOrder);
    // eslint-disable-next-line no-shadow
    setNFTQuery((nftQuery) => ({
      ...nftQuery,
      OrderByField: localOrder.Name,
      OrderByDirection: localOrder.Direction,
    }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseBackdrop = () => {
    setLoading(false);
  };

  const viewNFT = (item) => {
    History.push(`/nft/${item.collection}/${item.index}`);
  };

  const fetchNFTs = useCallback(async () => {
    try {
      const query = nftQuery;
      query.PageNo = page;

      const options = {
        mode: 'cors',
        body: JSON.stringify(query),
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const resp = await walletAuthFetchWithSigPrompt(
        `NFT/List`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );

      setNFTs(resp);
      const calcedPageCount = Math.ceil(
        resp.totalRecords / query.ResultsPerPage
      );
      setPageCount(calcedPageCount);
    } catch (error) {
      console.log('failed to fetch NFTs');
    }
  }, [account, nftQuery, page, wipeSignatureAndReRequest]);

  useEffect(() => {
    fetchNFTs();
  }, [account, chainId, fetchNFTs, wipeSignatureAndReRequest]);

  const NFTItemList = () => {
    return (
      <Grid container spacing={2} className={classes.marginZero}>
        {nfts?.nfTs?.map((nft) => (
          <Grid
            item
            lg={3}
            md={4}
            sm={6}
            xs={6}
            key={uuid_v4()}
            className={classes.perGameContainer}
          >
            <Card className="nftCard">
              <div className="nftImg">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${nft.image}`}
                  alt="nftImg"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="nftName">
                <div className="name">{nft.name}</div>
              </div>

              <CardContent className="nftInfo">
                <hr className="infoDivider" />

                <div className="infoWrapper">
                  <Typography className="infoRow" variant="body2">
                    {' '}
                    Tier : {nft.tierReadable}
                  </Typography>
                  <Typography className="infoRow" variant="body2">
                    {' '}
                    Level : {nft.level}{' '}
                    {nft.maxLevel !== 0 && <>/ {nft.maxLevel}</>}
                  </Typography>
                  <Typography className="infoRow" variant="body2">
                    {' '}
                    Scholar Slots : {nft.scholarSlots}{' '}
                    {nft.maxScholarSlots !== null && (
                      <>/ {nft.maxScholarSlots}</>
                    )}
                  </Typography>
                </div>
              </CardContent>

              <CardContent className="nftInfo">
                <Grid container spacing={isMobile === true ? 1 : 2}>
                  <Grid item lg={3} md={3} sm={3} xs={3}>
                    <a
                      href={`https://liquidcollectibles.io/collection/0x3e8bb868753357be4492958a8f63dfa29432996d/token/${nft.index}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="https://liquidcollectibles.io/images/tokens/0x4F3266a56589357B4f8082918b14B923693e57f0.png"
                        style={{ width: '100%' }}
                        alt="Liquid Collectibles"
                      />
                    </a>
                  </Grid>
                  <Grid item lg={3} md={3} sm={3} xs={3}>
                    <a
                      href={`https://www.thebullsoc.com/marketplace/0x3e8bb868753357be4492958a8f63dfa29432996d/${nft.index}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="https://www.thebullsoc.com/static/media/logo.162f27cd.svg"
                        style={{ width: '100%' }}
                        alt="The bull society"
                      />
                    </a>
                  </Grid>
                  <Grid item lg={3} md={3} sm={3} xs={3}>
                    <a
                      href={`https://pancakeswap.finance/nfts/collections/0x3E8bb868753357be4492958A8f63dfa29432996D/${nft.index}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="https://pancakeswap.finance/favicon.ico"
                        style={{ width: '100%' }}
                        alt="Pancake swap"
                      />
                    </a>
                  </Grid>
                  <Grid item lg={3} md={3} sm={3} xs={3}>
                    <a
                      href={`https://nftkey.app/collections/intothehifiverse/token-details/?tokenId=${nft.index}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={nftKeyImg}
                        style={{ width: '100%', borderRadius: '50%' }}
                        alt="NFT Key"
                      />
                    </a>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActionArea
                onClick={() => {
                  viewNFT(nft);
                }}
                className="moreInfo"
              >
                More Info
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const DesktopFilters = () => {
    return (
      <Grid container spacing={2} className="filterContainer">
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Input
            name="name"
            onChange={(e) => setInput({ Name: e.target.value })}
            label="NFT Name"
            defaultValue={nftQuery.Name}
            fullWidth
          />
        </Grid>
        <Grid item container lg={12} md={12} sm={12} xs={12}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="filterCategory">
            Level
            <hr />
          </Grid>

          <Grid item lg={5} md={5} sm={5} xs={5}>
            <Input
              name="minLevel"
              onChange={(e) => setInput({ MinLevel: e.target.value })}
              label="Min"
              defaultValue={nftQuery.MinLevel}
              className="numberField"
            />
          </Grid>
          <Grid item lg={1} md={1} sm={1} xs={1} />
          <Grid item lg={5} md={5} sm={5} xs={5}>
            <Input
              name="maxLevel"
              onChange={(e) => setInput({ MaxLevel: e.target.value })}
              label="Max"
              defaultValue={nftQuery.MaxLevel}
            />
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="filterCategory">
          Current Scholars
          <hr />
        </Grid>

        <Grid item container lg={12} md={12} sm={12} xs={12}>
          <Grid item lg={5} md={5} sm={5} xs={5}>
            <Input
              name="currentScholarsMin"
              onChange={(e) => setInput({ CurrentScholarsMin: e.target.value })}
              label="Min"
              defaultValue={nftQuery.CurrentScholarsMin}
              type="number"
            />
          </Grid>
          <Grid item lg={1} md={1} sm={1} xs={1} />
          <Grid item lg={5} md={5} sm={5} xs={5}>
            <Input
              name="currentScholarsMax"
              onChange={(e) => setInput({ CurrentScholarsMax: e.target.value })}
              label="Max"
              defaultValue={nftQuery.CurrentScholarsMax}
            />
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="filterCategory">
          Max Scholars
          <hr />
        </Grid>

        <Grid item container lg={12} md={12} sm={12} xs={12}>
          <Grid item lg={5} md={5} sm={5} xs={5}>
            <Input
              name="minTotalScholars"
              onChange={(e) => setInput({ MinTotalScholars: e.target.value })}
              label="Min"
              defaultValue={nftQuery.MinTotalScholars}
              InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              type="number"
            />
          </Grid>
          <Grid item lg={1} md={1} sm={1} xs={1} />
          <Grid item lg={5} md={5} sm={5} xs={5}>
            <Input
              name="maxTotalScholars"
              onChange={(e) => setInput({ MaxTotalScholars: e.target.value })}
              label="Max"
              defaultValue={nftQuery.MaxTotalScholars}
            />
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12} className="filterCategory">
          Tier
          <hr />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <MultiSelectCheckbox
            name="selectedTiers"
            fullWidth
            onChange={(e) => {
              setInput({ SelectedTiers: e.target.value });
            }}
            label="Tiers"
            selectedValues={nftQuery.SelectedTiers}
            options={[
              'Godly',
              'Legendary',
              'Epic',
              'Rare',
              'Uncommon',
              'Common',
            ]}
            defaultValue={nftQuery.SelectedTiers}
          />
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="searchButtonWrapper"
        >
          <Button
            variant="contained"
            onClick={clearFilters}
            className="clearButton"
          >
            Clear Filters
          </Button>
          <Button
            variant="contained"
            onClick={fetchNFTs}
            className="searchButton"
          >
            Search
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <BrowserView className="nftList">
        <Grid container>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12} className="filterTitle">
              Filters
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="filterWrapper"
            >
              <DesktopFilters />
            </Grid>
          </Grid>
          <Grid item lg={9} md={9} sm={12} xs={12}>
            <Box>
              <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12} className="nftCount">
                  <Grid container>
                    <Grid
                      item
                      lg={4}
                      md={4}
                      sm={4}
                      xs={4}
                      className="matchingCount"
                    >
                      <span>Matching NFTs:</span>
                      {nfts?.totalRecords}
                    </Grid>
                    <Grid
                      item
                      lg={8}
                      md={8}
                      sm={8}
                      xs={8}
                      className="topBarFilters"
                    >
                      <Grid container className="filters">
                        <Grid item lg={5} md={5} sm={5} xs={5}>
                          <CheckboxInput
                            name="onlyOwned"
                            onChange={(e) => {
                              setInput({
                                OnlyOwned: e.target.checked,
                              });
                            }}
                            label="Only Owned"
                            checked={nftQuery.OnlyOwned}
                          />
                        </Grid>
                        <Grid
                          item
                          lg={7}
                          md={7}
                          sm={7}
                          xs={7}
                          className="sorting"
                        >
                          <span>Sort:</span>
                          <Select
                            className="sortingSelect"
                            onChange={handleChangeSort}
                            value={order}
                          >
                            {sortingOptions.map((option) => (
                              <MenuItem
                                key={uuid_v4()}
                                className="multiSelectItem"
                                value={option}
                              >
                                {option.Label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <NFTItemList />

                {pageCount > 1 && (
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="nftPagination"
                  >
                    <Stack spacing={2}>
                      <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                      />
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Backdrop
          className={backdrops.backdrop}
          open={isLoading}
          onClick={handleCloseBackdrop}
          style={{ zIndex: 999999 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </BrowserView>
      <MobileView className="nftList mobile">
        <Box>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12} className="nftCount">
              <Grid container>
                <Grid item sm={12} xs={12} className="topBarFilters">
                  <Grid container className="filters">
                    <Grid item sm={4} xs={4}>
                      <CheckboxInput
                        name="onlyOwned"
                        onChange={(e) => {
                          setInput({
                            OnlyOwned: e.target.checked,
                          });
                        }}
                        label="Owned"
                        checked={nftQuery.OnlyOwned}
                      />
                    </Grid>
                    <Grid item sm={6} xs={6} className="sorting">
                      <span>Sort:</span>
                      <Select
                        className="sortingSelect"
                        onChange={handleChangeSort}
                        value={order}
                      >
                        {sortingOptions.map((option) => (
                          <MenuItem
                            key={uuid_v4()}
                            className="multiSelectItem"
                            value={option}
                          >
                            {option.Label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item sm={2} xs={2}>
                      <MobileFilters
                        nftQuery={nftQuery}
                        setInput={setInput}
                        fetchNFTs={fetchNFTs}
                        clearFilters={clearFilters}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="nftCount">
              <span>Matching NFTs:</span>
              {nfts?.totalRecords}
            </Grid>

            <NFTItemList />

            {pageCount > 1 && (
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="nftPagination"
              >
                <Stack spacing={2}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                  />
                </Stack>
              </Grid>
            )}
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

export default NFTList;
