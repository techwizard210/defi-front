import { ALL_GAMES, CURRENT_GAME, ADD_HISTORY } from '../../constants';

const Games = (
  state = {
    currentGame: {},
    allGames: [],
    playedHistory: [],
  },
  action
) => {
  switch (action.type) {
    case ALL_GAMES: {
      return { ...state, allGames: action.payload };
    }
    case CURRENT_GAME: {
      return { ...state, currentGame: action.payload };
    }
    case ADD_HISTORY: {
      return {
        ...state,
        playedHistory: [action.payload, ...state.playedHistory],
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default Games;
