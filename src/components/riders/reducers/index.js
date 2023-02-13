const initialData = {
  ridersData: [],
  ridersLoading: true,
};

export default function Rider(state = initialData, action) {
  switch (action.type) {
    case "GET_RIDERS":
      return {
        ...state,
        ridersLoading: true,
      };
    case "GET_RIDERS_FULFILLED":
      return {
        ...state,
        ridersData: action.payload,
        ridersLoading: false,
      };
    case "GET_RIDERS_REJECTED":
      return {
        ...state,
        ridersLoading: false,
      };

    case "CREATE_RIDER":
      return {
        ...state,
        ridersLoading: true,
      };
    case "CREATE_RIDER_FULFILLED":
      return {
        ...state,
        ridersLoading: false,
      };
    case "CREATE_RIDER_REJECTED":
      return {
        ...state,
        ridersLoading: false,
      };

    case "UPDATE_RIDER":
      return {
        ...state,
        ridersLoading: true,
      };
    case "UPDATE_RIDER_FULFILLED":
      return {
        ...state,
        ridersLoading: false,
      };
    case "UPDATE_RIDER_REJECTED":
      return {
        ...state,
        ridersLoading: false,
      };

    case "DELETE_RIDER":
      return {
        ...state,
        ridersLoading: true,
      };
    case "DELETE_RIDER_FULFILLED":
      return {
        ...state,
        ridersLoading: false,
      };
    case "DELETE_RIDER_REJECTED":
      return {
        ...state,
        ridersLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
