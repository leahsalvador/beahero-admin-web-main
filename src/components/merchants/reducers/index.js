const initialData = {
  merchantsData: [],
  merchantsLoading: true,
};

export default function Merchants(state = initialData, action) {
  switch (action.type) {
    case "GET_MERCHANTS":
      return {
        ...state,
        merchantsLoading: true,
      };
    case "GET_MERCHANTS_FULFILLED":
      return {
        ...state,
        merchantsData: action.payload,
        merchantsLoading: false,
      };
    case "GET_MERCHANTS_REJECTED":
      return {
        ...state,
        merchantsLoading: false,
      };

    case "CREATE_MERCHANT":
      return {
        ...state,
        merchantsLoading: true,
      };
    case "CREATE_MERCHANT_FULFILLED":
      return {
        ...state,
        merchantsLoading: false,
      };
    case "CREATE_MERCHANT_REJECTED":
      return {
        ...state,
        merchantsLoading: false,
      };

    case "UPDATE_MERCHANT":
      return {
        ...state,
        merchantsLoading: true,
      };
    case "UPDATE_MERCHANT_FULFILLED":
      return {
        ...state,
        merchantsLoading: false,
      };
    case "UPDATE_MERCHANT_REJECTED":
      return {
        ...state,
        merchantsLoading: false,
      };

    case "DELETE_MERCHANT":
      return {
        ...state,
        merchantsLoading: true,
      };
    case "DELETE_MERCHANT_FULFILLED":
      return {
        ...state,
        merchantsLoading: false,
      };
    case "DELETE_MERCHANT_REJECTED":
      return {
        ...state,
        merchantsLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
