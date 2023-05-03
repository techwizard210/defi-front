import { alpha, makeStyles } from '@material-ui/core/styles';

const FullborderRadius = '50%';
const defaultBg = 'rgba(228, 228, 228, 0.05) !important';

const useStyles = makeStyles((theme) => ({
  rootSection: {
    margin: theme.spacing(3, 0),
  },
  // Main
  browsegamelist: {
    fontWeit: theme.spacing(150),
  },
  marginTop: {
    marginTop: theme.spacing(5),
  },
  padding: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  paddingItem: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  defaultColor: {
    color: '#A2A3B7',
  },
  itemMain: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  itemTitle: {
    textAlign: 'center',
    alignItems: 'center',
  },
  itemBuy: {
    justifyContent: 'center',
  },
  defaultFontSize: {
    fontSize: '15px',
  },
  gpButton: {
    textTransform: 'none',
    color: '#a2a3b7',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& .dot': {
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: theme.spacing(1),
    },
    '& .dot.blue': {
      background: '#0049C6',
    },
    '& .dot.green': {
      background: '#7FBA7A',
    },
    '& .dot.orange': {
      background: '#FF754C',
    },
  },
  gameHeaderSection: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3, 0),
  },
  mGameHeaderSection: {
    width: '100%',
  },
  gameListSection: {
    padding: theme.spacing(7),
    paddingTop: theme.spacing(3),
  },
  gameCarouselOption: {
    height: '100%',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    borderRadius: '11px',
  },
  recommendImage: {
    position: 'absolute',
    padding: '2px',
    borderRadius: '11px',
  },

  // Swiper
  recommendGames: {
    position: 'absolute',
    top: '5%',
    zIndex: 2,
  },
  swiperContent: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    padding: '2px',
    borderRadius: '11px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
  },
  swiperMainContent: {},
  swiperContentBar: {},
  featuredSlider: {
    width: '75%',
    margin: '0 auto',
    display: 'flex',
    zIndex: 5,
    alignSelf: 'center',
    position: 'relative',
    '& .swiper-button-prev': {
      display: 'none',
    },
    '& .swiper-button-next': {
      display: 'none',
    },
  },
  featSwiperBg: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: 'calc(100% - 4px)',
    height: 'calc(100% - 4px)',
    zIndex: 1,
    borderRadius: '10px',
    backgroundColor: '#1a1a1a',
    '& .swiper-button-prev': {
      display: 'none',
    },
    '& .swiper-button-next': {
      display: 'none',
    },
    '& .swiper-container': {
      borderRadius: '10px',
    },
  },
  backImage: {
    filter: 'blur(5px)',
    transform: 'scale(1.3)',
  },
  mySwiper: {
    borderRadius: '11px',
    width: '80%',
  },
  prevButton: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateX(-50%)',
    cursor: 'pointer',
    outline: 'none',
  },
  nextButton: {
    position: 'absolute',
    top: '50%',
    right: '-10px',
    transform: 'translateX(-50%)',
    cursor: 'pointer',
    outline: 'none',
  },

  // Game Bar

  perGameContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  mainGameContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '11px',
    cursor: 'pointer',
    '&:hover': {
      '& .gameImage': {
        WebkitFilter: 'blur(5px)',
        filter: 'blur(5px)',
        transform: 'scale3d(1.1,1.1,1.1)',
        transition: 'transform 1s ease',
      },
      '& .gameType': {
        top: '10px',
      },
      '& .gameAction': {
        top: '50%',
      },
    },
  },
  gameType: {
    position: 'absolute',
    right: '10px',
    top: '-100%',
    fontSize: '.9rem',
    transition: 'all .3s ease',
    fontWeight: '500',
  },
  gameTitle: {
    zIndex: '102',
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
    transition: 'all .3s ease',
    width: '100%',
    padding: '5px 10px',
    fontSize: '.85rem',
    boxSizing: 'border-box',
  },
  gameAction: {
    position: 'absolute',
    top: '200%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '100%',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all .3s ease',
    fontSize: '1.2rem',
    fontWeight: 700,
    opacity: 0.6,
    '&:hover': {
      opacity: 1,
    },
  },
  realTitle: {
    zIndex: 1,
  },
  // Search Bar
  search: {
    position: 'relative',
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    height: '80%',
    display: 'flex',
    borderRadius: theme.spacing(4),
  },
  mSearch: {
    position: 'relative',
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    height: '80%',
    display: 'flex',
    borderRadius: theme.spacing(4),
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
    color: 'inherit',
  },
  inputInput: {
    padding: '1px 1px 1px 0 !important',
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)  !important`,
    transition: theme.transitions.create('width'),
    width: '100% !important',
  },

  // Icon Button Style
  IconButtonStyle: {
    backgroundColor: 'rgba(0,0,0,.24)',
    margin: theme.spacing(1),
  },

  // Game Type Buttons
  gameTypeBar: {
    flexWrap: 'nowrap',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },
  gameSearchBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mGameSearchBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
  },

  btnGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: theme.spacing(45),
  },
  btn: {
    width: theme.spacing(20),
    height: theme.spacing(7),
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },
  btnHoverColor: {
    backgroundColor: '#ed51a3',
  },
  // First Game List
  gameListContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  fgames: {
    // display: 'flex',
    // justifyContent: 'space-around',
    // height: '100%'
  },
  customGrid: {
    margin: '-16px auto',
  },
  fchild: {
    backgroundColor: 'rgba(0,0,0,.24)',
    height: '100%',
    borderRadius: theme.spacing(3),
    paddingBottom: '0px !important',
  },
  mFchild: {
    backgroundColor: 'rgba(0,0,0,.24)',
    height: '100%',
    borderRadius: theme.spacing(1),
    paddingBottom: '0px !important',
  },
  gamecontent: {
    // padding: '0 !important',
    // backgroundColor: 'rgba(0,0,0,.24)',
    // borderRadius: theme.spacing(2),
    // height: '100%',
    // [theme.breakpoints.up('xs')]: {
    //     maxWidth: `98%`,
    // },
    // [theme.breakpoints.up('sm')]: {
    //     maxWidth: `98%`,
    // },
    // [theme.breakpoints.up('md')]: {
    //     maxWidth: `46%`,
    // },
    // [theme.breakpoints.up('lg')]: {
    //     maxWidth: `24%`,
    // },
  },
  media: {
    height: '100%',
    paddingTop: '100%',
    backgroundSize: 'cover',
    borderRadius: theme.spacing(3),
  },
  cardimg: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: theme.spacing(2),
  },
  cardtext: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: theme.spacing(3),
    paddingBottom: '0 !important',
  },
  mCardtext: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: theme.spacing(3),
    padding: '5px !important',
  },
  active: {
    borderRadius: FullborderRadius,
    width: theme.spacing(1),
    height: theme.spacing(1),
    display: 'inline-block',
    backgroundColor: '#7FBA7A',
    marginRight: '10px',
  },
  disable: {
    borderRadius: FullborderRadius,
    width: theme.spacing(1),
    height: theme.spacing(1),
    display: 'inline-block',
    backgroundColor: '#FF754C',
    marginRight: '10px',
  },
  statusbar: {
    marginTop: '10px',
    textAlign: 'center',
  },

  // Search Results
  searchResult: {
    borderRadius: theme.spacing(5),
    height: '100%',
    width: '100%',
  },
  morespecific: {
    position: 'relative',
    backgroundSize: '100%',
    height: '100%',
  },
  cardmedia: {
    width: '100%',
    height: theme.spacing(120),
    borderRadius: theme.spacing(4),
  },
  arrowimg: {
    width: theme.spacing(6),
  },
  ArrowLeft: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  ArrowRight: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  actions: {
    position: 'absolute',
    bottom: '0',
    left: '20%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  maintitle: {
    marginTop: theme.spacing(2),
  },
  chipStyle: {
    background: 'rgba(108, 93, 211, .5)',
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  playbtn: {
    marginTop: theme.spacing(1),
  },
  scontainer: {
    height: '100%',
    width: '100%',
  },
  // scardparentimg : {
  //     height: '100%',
  //     width: '100%'
  // },
  sgamecontent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(3),
  },
  scard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(2),
    background: 'rgba(0,0,0,.24)',
  },
  scardimg: {
    height: '100%',
    // paddingTop: '56.25%',
    width: '100%',
    borderRadius: theme.spacing(3),
  },
  scardimgm: {
    height: '100%',
    width: '100%',
    borderRadius: theme.spacing(3),
  },
  scardtext: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
  },
  searchResultChip: {
    color: '#3F8CFF !important',
    backgroundColor: defaultBg,
    borderRadius: '8px !important',
    marginRight: theme.spacing(1),
  },
  smargin: {
    marginTop: theme.spacing(2),
  },
  stitle: {
    fontSize: '17px',
  },

  // Recommended for you
  recommendtitle: {
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: '12',
  },
  rhead: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  browseMenu: {
    width: theme.spacing(30),
    height: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.24)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    '& .MuiSelect-select.MuiSelect-select': {
      paddingRight: 36,
    },
  },
  select: {
    color: '#a2a3b7',
  },
  bchildelement: {
    padding: theme.spacing(2),
  },
  bcard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    backgroundColor: 'rgba(0,0,0,.24)',
    marginTop: theme.spacing(2),
  },
  bgamecontent: {
    justifyContent: 'space-between',
  },
  tgrid: {
    borderRadius: theme.spacing(3),
    [theme.breakpoints.up('xs')]: {
      maxWidth: '98%',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '46%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '23%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '23%',
    },
  },
  tcardimg: {
    height: theme.spacing(40),
    borderRadius: theme.spacing(3),
  },
  tcardtext: {
    display: 'flex',
    alignItems: 'center',
    padding: '10%',
  },
  RecommendedChip: {
    position: 'absolute',
    left: theme.spacing(2),
    top: theme.spacing(2),
    width: theme.spacing(12),
    height: theme.spacing(3),
    background: 'rgba(0, 0, 0, .5) !important',
    borderRadius: '8px !important',
    marginRight: theme.spacing(1),
  },

  // All games
  allGamesList: {
    // padding: theme.spacing(1),
  },
  allGamesListroot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    '& ul': {
      height: 'auto',
    },
  },
  gridTileAllGame: {
    '& .MuiGridListTile-tile': {
      borderRadius: theme.spacing(2),
    },
  },
  gridList: {
    width: '100%',
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  allPlayBtn: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  allbtn: {
    width: theme.spacing(2),
    height: theme.spacing(4),
    marginRight: theme.spacing(2),
    textTransform: 'none',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },
  // Filter option Root
  filterOptionRoot: {},

  // Mobile View
  mGameList: {
    '& .first-game-list-0': {
      padding: theme.spacing(1, 1, 1, 0),
    },
    '& .first-game-list-1': {
      padding: theme.spacing(1, 1, 1, 1),
    },
    '& .first-game-list-2': {
      padding: theme.spacing(1, 0, 1, 1),
    },
  },
  mItemCard: {
    padding: '6px',
  },
  mItemTitle: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.7rem',
  },
  mItemBuyButton: {
    display: 'flex',
    padding: '0.2px',
    fontSize: '0.6rem',
  },
  marginZero: {
    margin: 0,
  },

  pageAlert: {
    margin: '10px',
    padding: '15px',
    fontFamily: 'Poppins',
    fontWeight: 300,
    borderRadius: '12px',
    color: '#001226',
    backgroundColor: '#7399c1',
    borderColor: '#b8daff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px',
  },
}));

export default useStyles;
