import React, { createContext, useReducer } from "react";
import Reducer from '../reducers/storeReducer'


const initialState = {
    error: '',
    userStatus: {
        isLoggedIn: false,
        userCheckedIn: false,
        userEmail: null,
        userId: null,
        userType: null,
        userVacations: [], 
    },
    vacationsStatus:{
        data: [],
        error: null
    },
};

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;