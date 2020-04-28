import React, { useEffect, useContext } from 'react';
import { Context } from '../../stores/globalStore';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import VacationWrapper from '../../components/Vacations/VacationWrapper';
import axios from 'axios'
import mainLogo from '../../images/ivacation-text.png'
import './Home.css';


const useStyles = makeStyles((theme) => ({
    logoImg: {
        maxWidth: '10rem',
        marginBottom: '0.2rem',
    },
}));

const Home = () => {

    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    /* Checks if user has data and is logged in*/
    useEffect(() => {
        if (!state.userStatus.userCheckedIn || !state.userStatus.userType) {
            axios.get('http://localhost:8000/users/profile', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    dispatch({ type: 'SET_DATA', payload: response.data.data[0] });
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOGGED_OUT' });
                    history.push('/login')
                });
        } else if (!state.userStatus.isLoggedIn)
            history.push('/login')
    }, [dispatch, history, state.userStatus.userCheckedIn, state.userStatus.isLoggedIn, state.userStatus.userType]);


    return (
        !state.userStatus.isLoggedIn || !state.userStatus.userCheckedIn ? '' :
            <div className='home-p'>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '5vh' }}
                >
                    <img className={classes.logoImg} src={mainLogo} alt='site logo' />
                    
                </Grid>
                <VacationWrapper />
            </div>
    )
}


export default Home
