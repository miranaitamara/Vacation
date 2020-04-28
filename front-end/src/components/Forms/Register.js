import React, { useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormHelperText, Container, CssBaseline, TextField, Button, Grid, Typography } from '@material-ui/core';
import registerReducer from '../../reducers/registerReducer'
import axios from 'axios'



const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Register = () => {

    const classes = useStyles()
    const history = useHistory()

    const initialState = {
        email: '',
        password: '',
        password2: '',
        isLoading: false,

        errorEmail: false,
        errorPassword: false,
        errorEmailMsg: '',
        errorPasswordMsg: '',

        errorServer: false,
    };

    const [registerState, registerDispatch] = useReducer(registerReducer, initialState);

    /* Handles form submit */
    const handleSubmit = (e) => {
        e.preventDefault();

        let validation = validateData();
        if (!validation) return false

        registerDispatch({ type: 'SET_LOADING' })

        axios.post('http://localhost:8000/users', {
            email: registerState.email,
            password: registerState.password,
        })
            .then((response) => {
                registerDispatch({ type: 'REGISTER_SUCCESS' });
                history.push('/login')
            })
            .catch((error) => {
                let errorEmail = false;
                let errorEmailMsg = '';
                let errorServer = false;

                if (error.response.status >= 500 && error.response.status < 600)
                    errorServer = true;

                if (error.response.status === 409) {
                    errorEmail = true;
                    errorEmailMsg = 'Email is already registered'
                }

                if (errorEmail || errorServer)
                    registerDispatch({ type: 'SET_ERROR', payload: { errorEmail, errorEmailMsg, errorServer } })

            });
    }

    /* Validates stored values */
    const validateData = (e) => {
        let errorEmail = false;
        let errorPassword = false;
        let errorEmailMsg = '';
        let errorPasswordMsg = '';

        const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (registerState.password !== registerState.password2) {
            errorPassword = true;
            errorPasswordMsg = 'Both passwords must match';
        }

        if (registerState.password.length < 6) {
            errorPassword = true;
            errorPasswordMsg = 'Password must be more then 6 characters';
        }

        if (!regexp.test(registerState.email)) {
            errorEmail = true;
            errorEmailMsg = 'Invalid email address';
        }

        registerDispatch({ type: 'SET_ERROR', payload: { errorEmail, errorPassword, errorEmailMsg, errorPasswordMsg } })
        if (errorEmail || errorPassword) return false
        else return true
    }

    return (
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Register
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <TextField
                            error={registerState.errorEmail}
                            helperText={registerState.errorEmailMsg}
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            name='email'
                            autoFocus
                            autoComplete='new-email'
                            value={registerState.email}
                            onChange={e =>
                                registerDispatch({
                                    type: 'SET_FIELD',
                                    fieldName: 'email',
                                    payload: e.currentTarget.value,
                                })
                            }
                        />
                        <TextField
                            error={registerState.errorPassword}
                            helperText={registerState.errorPasswordMsg}
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            label='Password'
                            type='password'
                            id='password'
                            autoComplete='new-password'
                            value={registerState.password}
                            onChange={e =>
                                registerDispatch({
                                    type: 'SET_FIELD',
                                    fieldName: 'password',
                                    payload: e.currentTarget.value,
                                })
                            }
                        />
                        <TextField
                            error={registerState.errorPassword}
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password2'
                            label='Repeat Password'
                            type='password'
                            id='password2'
                            autoComplete='off'
                            value={registerState.passowrd2}
                            onChange={e =>
                                registerDispatch({
                                    type: 'SET_FIELD',
                                    fieldName: 'password2',
                                    payload: e.currentTarget.value,
                                })
                            }
                        />
                        {registerState.errorServer && <FormHelperText error>Please try again later</FormHelperText>}
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='primary'
                            className={classes.submit}
                            disabled={registerState.isLoading}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to='/login' variant='body2'>
                                    {'Have an account? Sign In'}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
    );

}



export default Register