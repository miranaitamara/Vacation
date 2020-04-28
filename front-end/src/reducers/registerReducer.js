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

                errorEmail: false,
                errorPassword: false,
                errorServer: false,
                errorEmailMsg: '',
                errorPasswordMsg: '',

                isLoading: true,
            };
        }
        case 'SET_ERROR': {
            return {

                ...state,
                ...action.payload,

                isLoading: false,
            };
        }
        case 'REGISTER_SUCCESS': {
            return {
                ...state,
                
                isLoading: false,

                errorEmail: false,
                errorPassword: false,
                errorServer: false,
                errorEmailMsg: '',
                errorPasswordMsg: '',

                email: '',
                password: '',
            };
        }
        default:
            return state;
    }
}

export default Reducer;