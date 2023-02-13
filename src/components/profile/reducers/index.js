const initialData = {
  profileData: {},
  profileLoading: false,
};

export default function profile(state = initialData, action) {
  switch (action.type) {
    case 'GET_PROFILE':
      return {
        ...state,
        profileLoading: true,
      };
    case 'GET_PROFILE_FULFILLED':
      return {
        ...state,
        profileData: action.payload,
        profileLoading: false,
      };
    case 'GET_PROFILE_REJECTED':
      return {
        ...state,
        profileLoading: false,
      };

    case 'EDIT_PROFILE':
      return {
        ...state,
        profileLoading: true,
      };
    case 'EDIT_PROFILE_FULFILLED':
      return {
        ...state,
        profileLoading: false,
      };
    case 'EDIT_PROFILE_REJECTED':
      return {
        ...state,
        profileLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
}
