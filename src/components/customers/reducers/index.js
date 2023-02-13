const initialData = {
  customersData: [],
  customersLoading: true,
};

export default function Customers(state = initialData, action) {
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

    case "CREATE_CUSTOMER":
      return {
        ...state,
        customersLoading: true,
      };
    case "CREATE_CUSTOMER_FULFILLED":
      return {
        ...state,
        customersLoading: false,
      };
    case "CREATE_CUSTOMER_REJECTED":
      return {
        ...state,
        customersLoading: false,
      };

    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customersLoading: true,
      };
    case "UPDATE_CUSTOMER_FULFILLED":
      return {
        ...state,
        customersLoading: false,
      };
    case "UPDATE_CUSTOMER_REJECTED":
      return {
        ...state,
        customersLoading: false,
      };

    case "DELETE_CUSTOMER":
      return {
        ...state,
        customersLoading: true,
      };
    case "DELETE_CUSTOMER_FULFILLED":
      return {
        ...state,
        customersLoading: false,
      };
    case "DELETE_CUSTOMER_REJECTED":
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
