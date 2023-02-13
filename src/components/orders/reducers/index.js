const initialData = {
  transactionsData: [],
  transactionsLoading: false,
  merchantsData: [],
};

export default function transactions(state = initialData, action) {
  switch (action.type) {
    case 'UPDATE_TRANSACTION_STATUS':
      return {
        ...state,
        transactionsLoading: true,
      };
    case 'UPDATE_TRANSACTION_STATUS_FULFILLED':
      return {
        ...state,
        transactionsLoading: false,
      };
    case 'UPDATE_TRANSACTION_STATUS_REJECTED':
      return {
        ...state,
        transactionsLoading: false,
      };

    case 'GET_MERCHANT_TRANSACTIONS':
      return {
        ...state,
        transactionsLoading: true,
      };
    case 'GET_MERCHANT_TRANSACTIONS_FULFILLED':
      return {
        ...state,
        transactionsData: action.payload,
        transactionsLoading: false,
      };
    case 'GET_MERCHANT_TRANSACTIONS_REJECTED':
      return {
        ...state,
        transactionsLoading: false,
      };

    case 'GET_MERCHANTS':
      return {
        ...state,
        transactionsLoading: true,
      };
    case 'GET_MERCHANTS_FULFILLED':
      return {
        ...state,
        merchantsData: action.payload,
        transactionsLoading: false,
      };
    case 'GET_MERCHANTS_REJECTED':
      return {
        ...state,
        transactionsLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
}
