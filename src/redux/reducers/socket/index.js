import { CUSTOMER_SOCKET, SOCKET_ID, IDLE_STATUS } from '../../constants';

const Socket = (
  state = {
    socket_id: null,
    socket_data: null,
    idle_status: false,
  },
  action
) => {
  switch (action.type) {
    case SOCKET_ID: {
      return { ...state, socket_id: action.payload };
    }
    case CUSTOMER_SOCKET: {
      return { ...state, socket_data: action.payload };
    }
    case IDLE_STATUS: {
      return { ...state, idle_status: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};

export default Socket;
