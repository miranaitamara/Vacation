const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,

                error: false,
                data: action.payload
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,

                error: true,
                data: []
            };
        }
        default:
            return state;
    }
}

export default Reducer;