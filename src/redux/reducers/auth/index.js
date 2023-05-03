import { SESSION, SESSION_OUT, NEW_USER } from '../../constants';

const Auth = (
  state = {
    session: {},
    isNewUser: null,
    isSession: false,
  },
  action
) => {
  switch (action.type) {
    case SESSION: {
      return { ...state, isSession: true, session: action.payload };
    }
    case SESSION_OUT: {
      return { ...state, isSession: false, session: action.payload };
    }
    case NEW_USER: {
      return { ...state, isNewUser: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};

export default Auth;
