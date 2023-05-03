import { PROFILE } from '../../constants';

const Profile = (
  state = {
    profile: {},
  },
  action
) => {
  switch (action.type) {
    case PROFILE: {
      return { ...state, ...action.payload };
    }
    default: {
      return { ...state };
    }
  }
};

export default Profile;
