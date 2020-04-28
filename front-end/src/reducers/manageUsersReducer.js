const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,

                users: action.payload,
                error: false
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,
                error: true
            };
        }
        default:
            return state;
    }
}

export default Reducer;