const initialData = {
  ratesData: [],
  ratesLoading: false,
  merchantsData: [],
};

export default function fetchCategories(state = initialData, action) {
  switch (action.type) {
    case 'GET_RATES':
      return {
        ...state,
        ratesLoading: true,
      };
    case 'GET_RATES_FULFILLED':
      return {
        ...state,
        ratesData: action.payload,
        ratesLoading: false,
      };
    case 'GET_RATES_REJECTED':
      return {
        ...state,
        ratesLoading: false,
      };

    case 'POST_RATES':
      return {
        ...state,
        ratesLoading: true,
      };
    case 'POST_RATES_FULFILLED':
      return {
        ...state,
        ratesLoading: false,
      };
    case 'POST_RATES_REJECTED':
      return {
        ...state,
        ratesLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
}
