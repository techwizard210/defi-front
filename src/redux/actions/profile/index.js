import { PROFILE } from '../../constants';

export const setProfile = (profile) => {
  return (dispatch) =>
    dispatch({
      type: PROFILE,
      payload: profile,
    });
};
