const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                userStatus: {
                    isLoggedIn: true,
                    userCheckedIn: true,
                    userType: action.payload.userType,
                    userEmail: action.payload.Email,
                    userId: action.payload.Id,
                    userVacations: action.payload.Vacations ? action.payload.Vacations : [],
                },
            };
        case 'UPDATE_VACATIONS_DATA':
            return {
                ...state,
                userStatus: {
                    ...state.userStatus,
                    userVacations: action.payload
                },
            };
        case 'SET_LOGGED_IN':
            return {
                ...state,
                userStatus: {
                    isLoggedIn: true,
                    userCheckedIn: true,
                },
            };
        case 'SET_LOGGED_OUT':
            return {
                ...state,
                userStatus: {
                    isLoggedIn: false,
                    userCheckedIn: true,
                    userType: null,
                    userId: null,
                    userVacations: [],
                },
                vacationsStatus: {
                    data: [],
                    error: null,
                }
            };
        case 'ADD_VACATION_TO_USER':
            return {
                ...state,
                userStatus: {
                    ...state.userStatus,
                    userVacations: [
                        ...state.userStatus.userVacations,
                        {
                            id: action.payload.id,
                            Name: action.payload.name,
                            Image: action.payload.image,
                            Status: 'pending approval',
                            lastStatusChange: null
                        }
                    ],
                },
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'SET_VACATIONS':
            return {
                ...state,
                vacationsStatus: {
                    data: action.payload,
                    error: null,
                }
            }
        case 'SET_VACATIONS_ERROR':
            return {
                ...state,
                vacationsStatus: {
                    data: [],
                    error: action.payload,
                }
            }
        default:
            return state;
    }
};

export default Reducer;