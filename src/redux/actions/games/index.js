import { ALL_GAMES, CURRENT_GAME } from '../../constants';

export const setAllGames = (games) => {
  return (dispatch) =>
    dispatch({
      type: ALL_GAMES,
      payload: games,
    });
};

export const setCurrentGame = (game) => {
  return (dispatch) =>
    dispatch({
      type: CURRENT_GAME,
      payload: game,
    });
};
