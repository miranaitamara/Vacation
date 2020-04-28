import React, { createContext, useReducer } from "react";
import Reducer from '../reducers/manageVacationsReducer'


const initialState = {
    vacations: [],
    vacationEdit: {},
    error: false
};

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <ManageVacationsContext.Provider value={[state, dispatch]}>
            {children}
        </ManageVacationsContext.Provider>
    )
};

export const ManageVacationsContext = createContext(initialState);
export default Store;