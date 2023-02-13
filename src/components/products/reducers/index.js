const initialData = {
  productsData: [],
  productsLoading: false,
  merchantsData: []
};

export default function fetchCategories(state = initialData, action) {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        productsLoading: true,
      };
    case "GET_PRODUCTS_FULFILLED":
      return {
        ...state,
        productsData: action.payload,
        productsLoading: false,
      };
    case "GET_PRODUCTS_REJECTED":
      return {
        ...state,
        productsLoading: false,
      };

    case "CREATE_PRODUCT":
      return {
        ...state,
        productsLoading: true,
      };
    case "CREATE_PRODUCT_FULFILLED":
      return {
        ...state,
        productsLoading: false,
      };
    case "CREATE_PRODUCT_REJECTED":
      return {
        ...state,
        productsLoading: false,
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        productsLoading: true,
      };
    case "UPDATE_PRODUCT_FULFILLED":
      return {
        ...state,
        productsLoading: false,
      };
    case "UPDATE_PRODUCT_REJECTED":
      return {
        ...state,
        productsLoading: false,
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        productsLoading: true,
      };
    case "DELETE_PRODUCT_FULFILLED":
      return {
        ...state,
        productsLoading: false,
      };
    case "DELETE_PRODUCT_REJECTED":
      return {
        ...state,
        productsLoading: false,
      };

    case "GET_PRODUCTS_MERCHANT":
      return {
        ...state,
        productsLoading: true,
      };
    case "GET_PRODUCTS_MERCHANT_FULFILLED":
      return {
        ...state,
        productsData: action.payload,
        productsLoading: false,
      };
    case "GET_PRODUCTS_MERCHANT_REJECTED":
      return {
        ...state,
        productsLoading: false,
      };
    case "GET_MERCHANTS":
      return {
        ...state,
        productsLoading: true,
      };
    case "GET_MERCHANTS_FULFILLED":
      return {
        ...state,
        merchantsData: action.payload,
        productsLoading: false,
      };
    case "GET_MERCHANTS_REJECTED":
      return {
        ...state,
        productsLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
}
