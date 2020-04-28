import React, { useReducer } from 'react';
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { FormHelperText, Container, CssBaseline, TextField, Button, Grid, Typography } from '@material-ui/core';
import loginReducer from '../../reducers/loginReducer'
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



const Login = () => {
    const classes = useStyles()
    const history = useHistory()

    const initialState = {
        email: '',
        password: '',
        isLoading: false,
        error: false,
        errorType: '',
        errorMsg: '',
    };

    const [loginState, loginDispatch] = useReducer(loginReducer, initialState);

    /* Handles form submit */
    const handleSubmit = (e) => {
        e.preventDefault();

        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regexp.test(loginState.email))
            return loginDispatch({ type: 'SET_ERROR', payload: { errorType: 'email', errorMsg: 'Enter a valid email' } })

        if (loginState.password.length < 6)
            return loginDispatch({ type: 'SET_ERROR', payload: { errorType: 'password', errorMsg: 'Password must be 6 characters or more' } })

        loginDispatch({ type: 'SET_LOADING' });

        axios.post('http://localhost:8000/users/login', {
            email: loginState.email,
            password: loginState.password,
        }, {
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                loginDispatch({ type: 'LOGIN_SUCCESS' });
                history.push('/')
            })
            .catch((error) => {
                let errorType = false;
                let errorMsg = ''

                if (!error.response)
                    errorType = 'server'
                else if (error.response.status >= 500 && error.response.status < 600)
                    errorType = 'server'
                else if (error.response.status === 401) {
                    errorType = 'email'
                    errorMsg = 'Email or Password is incorrect'
                }
                if (errorType)
                    loginDispatch({ type: 'SET_ERROR', payload: { errorType, errorMsg } })
            });
    }

    return (
            <Container component="div" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <TextField
                            error={loginState.error}
                            helperText={loginState.errorType === 'email' && loginState.errorMsg}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={loginState.email}
                            onChange={e =>
                                loginDispatch({
                                    type: 'SET_FIELD',
                                    fieldName: 'email',
                                    payload: e.currentTarget.value,
                                })
                            }
                        />
                        <TextField
                            error={loginState.error}
                            helperText={loginState.errorType === 'password' && loginState.errorMsg}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={loginState.password}
                            onChange={e =>
                                loginDispatch({
                                    type: 'SET_FIELD',
                                    fieldName: 'password',
                                    payload: e.currentTarget.value,
                                })
                            }
                        />
                        {loginState.errorType === 'server' && <FormHelperText error>Please try again later</FormHelperText>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loginState.isLoading}
                        >
                            Sign In
                        </Button>
                        <Grid container>

                            <Grid item xs>
                                <Link to="" variant="body2">
                                    Forgot password?
                            </Link>
                            </Grid>

                            <Grid item>
                                <Link to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>

                        </Grid>
                    </form>
                </div>
            </Container>
    );

}



export default Login
