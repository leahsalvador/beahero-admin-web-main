const initialData = {
  customersData: [],
  customersLoading: true,
};

export default function createRider(state = initialData, action) {
  switch (action.type) {
    case "GET_CUSTOMERS":
      return {
        ...state,
        customersLoading: true,
      };
    case "GET_CUSTOMERS_FULFILLED":
      return {
        ...state,
        customersData: action.payload,
        customersLoading: false,
      };
    case "GET_CUSTOMERS_REJECTED":
      return {
        ...state,
        customersLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
