const initialData = {
  categoriesData: [],
  categoriesLoading: false,
  merchantsData: [],
};

export default function fetchCategories(state = initialData, action) {
  switch (action.type) {
    case "GET_CATEGORIES":
      return {
        ...state,
        categoriesLoading: true,
      };
    case "GET_CATEGORIES_FULFILLED":
      return {
        ...state,
        categoriesData: action.payload,
        categoriesLoading: false,
      };
    case "GET_CATEGORIES_REJECTED":
      return {
        ...state,
        categoriesLoading: false,
      };

    case "CREATE_CATEGORY":
      return {
        ...state,
        categoriesLoading: true,
      };
    case "CREATE_CATEGORY_FULFILLED":
      return {
        ...state,
        categoriesLoading: false,
      };
    case "CREATE_CATEGORY_REJECTED":
      return {
        ...state,
        categoriesLoading: false,
      };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categoriesLoading: true,
      };
    case "UPDATE_CATEGORY_FULFILLED":
      return {
        ...state,
        categoriesLoading: false,
      };
    case "UPDATE_CATEGORY_REJECTED":
      return {
        ...state,
        categoriesLoading: false,
      };

    case "DELETE_CATEGORY":
      return {
        ...state,
        categoriesLoading: true,
      };
    case "DELETE_CATEGORY_FULFILLED":
      return {
        ...state,
        categoriesLoading: false,
      };
    case "DELETE_CATEGORY_REJECTED":
      return {
        ...state,
        categoriesLoading: false,
      };

    case "GET_MERCHANTS":
      return {
        ...state,
        categoriesLoading: true,
      };
    case "GET_MERCHANTS_FULFILLED":
      return {
        ...state,
        merchantsData: action.payload,
        categoriesLoading: false,
      };
    case "GET_MERCHANTS_REJECTED":
      return {
        ...state,
        categoriesLoading: false,
      };

    case "GET_CATEGORIES_MERCHANT":
      return {
        ...state,
        categoriesLoading: true,
      };
    case "GET_CATEGORIES_MERCHANT_FULFILLED":
      return {
        ...state,
        categoriesData: action.payload,
        categoriesLoading: false,
      };
    case "GET_CATEGORIES_MERCHANT_REJECTED":
      return {
        ...state,
        categoriesLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
}
