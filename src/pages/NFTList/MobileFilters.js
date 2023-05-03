/* jshint esversion: 6 */
import { useState, forwardRef } from 'react';

// ** Import Material-Ui Components & Icons
import Grid from '@material-ui/core/Grid';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import Input from './Input';
import MultiSelectCheckbox from './MultiSelect';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const MobileFilters = (props) => {
  const { setInput, nftQuery, fetchNFTs, clearFilters } = props;

  // ** Declare States
  const [showFilters, setShowFilters] = useState(false);

  const searchClick = () => {
    setShowFilters(false);
    fetchNFTs();
  };

  const handleClose = () => {
    setShowFilters(false);
  };

  const clearClick = () => {
    setShowFilters(false);
    clearFilters();
  };

  // ** Render Components
  return (
    <div className="filterWrapper">
      <FilterAltIcon onClick={() => setShowFilters(!showFilters)} />

      <Dialog
        fullScreen
        open={showFilters}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Grid container spacing={2} className="filterContainer">
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
              onClick={() => setShowFilters(false)}
              className="searchButton"
            >
              Close
            </Button>
          </Grid>
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
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="filterCategory"
            >
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
                onChange={(e) =>
                  setInput({ CurrentScholarsMin: e.target.value })
                }
                label="Min"
                defaultValue={nftQuery.CurrentScholarsMin}
                type="number"
              />
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} />
            <Grid item lg={5} md={5} sm={5} xs={5}>
              <Input
                name="currentScholarsMax"
                onChange={(e) =>
                  setInput({ CurrentScholarsMax: e.target.value })
                }
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
              onClick={clearClick}
              className="clearButton"
            >
              Clear Filters
            </Button>
            <Button
              variant="contained"
              onClick={searchClick}
              className="searchButton"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default MobileFilters;
