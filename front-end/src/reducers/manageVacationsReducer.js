const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,

                vacations: action.payload,
                error: false
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,

                vacations: [],
                error: true
            };
        }
        case 'SET_EDIT': {
            return {
                ...state,
                vacationEdit: {...action.payload}
            }
        }
        default:
            return state;
    }
}

export default Reducer;