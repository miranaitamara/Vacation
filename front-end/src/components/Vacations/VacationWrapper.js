import React, { useEffect, useContext } from 'react';
import { Context } from '../../stores/globalStore';
import { Box } from '@material-ui/core';
import axios from 'axios'
import VacationCard from './VacationCard'



const VacationWrapper = () => {

    const [state, dispatch] = useContext(Context);
    useEffect(() => {
        axios.get('http://localhost:8000/vacations', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                dispatch({ type: 'SET_VACATIONS', payload: response.data.data });
            })
            .catch(error => {
                dispatch({ type: 'SET_VACATIONS_ERROR' , payload: error});
            });
    }, [dispatch]);


    let vacationsArr = state.vacationsStatus.data;
    let vacationCards = vacationsArr.map(item => {
        return <VacationCard vacation={item} key={item.id + 1} />
    })

    return (
        <div className='home-p'>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
                {vacationCards}
            </Box>
        </div >
    )
}


export default VacationWrapper
