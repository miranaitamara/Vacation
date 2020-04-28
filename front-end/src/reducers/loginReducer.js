const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'SET_LOADING': {
            return {
                ...state,

                error: false,
                errorType: '',
                errorMsg: '',

                isLoading: true,
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,

                error: true,
                errorType: action.payload.errorType,
                errorMsg: action.payload.errorMsg,

                isLoading: false,
            };
        }
        case 'LOGIN_SUCCESS': {
            return {
                ...state,
                isLoading: false,

                error: false,
                errorType: '',
                errorMsg: '',

                email: '',
                password: '',
            };
        }
        default:
            return state;
    }
}

export default Reducer;