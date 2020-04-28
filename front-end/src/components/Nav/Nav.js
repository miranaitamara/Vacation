import React, { useContext } from 'react';
import clsx from 'clsx';
import { Context } from '../../stores/globalStore';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, CssBaseline, Divider, IconButton } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import GroupIcon from '@material-ui/icons/Group';

import logoText from '../../images/ivacation-onlytext.png'
import axios from 'axios'

import './Nav.css';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        overflowX: 'hidden',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    topName: {
        display: 'flex',
        margin: '0 auto',
    },
    topNameOpen: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        width: 200,
        overflowX: 'hidden',
    },
    topNameClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0,

        overflowX: 'hidden',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    footernav: {
        marginTop: 'auto',
        marginBottom: '10px',
    },
}));

const Nav = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory()
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleNavClick = (e) => {
        e.preventDefault();
        const name = e.currentTarget.getAttribute('name')
        history.push('/' + name)
    }

    const handleLogout = (e) => {
        e.preventDefault();
        axios.delete('http://localhost:8000/users/logout', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                dispatch({ type: 'SET_LOGGED_OUT' });
                history.push('/login')
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
            });
    }

    return (
        !state.userStatus.isLoggedIn || !state.userStatus.userCheckedIn ? '' :
            <nav className={classes.root}>
                <CssBaseline />
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <img src={logoText} alt='company name' className={clsx(classes.topName, {
                            [classes.topNameOpen]: open,
                            [classes.topNameClose]: !open,
                        })} />
                        <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button name='home' onClick={handleNavClick}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary='Home' />
                        </ListItem>

                        <ListItem button name='new' onClick={handleNavClick}>
                            <ListItemIcon><NewReleasesIcon /></ListItemIcon>
                            <ListItemText primary="New" />
                        </ListItem>

                        <ListItem button name='hot' onClick={handleNavClick}>
                            <ListItemIcon><WhatshotIcon /></ListItemIcon>
                            <ListItemText primary="What's Hot" />
                        </ListItem>
                    </List>
                    <Divider />
                    {state.userStatus.userType !== 'admin' ? '' :
                        <List style={{ color: '#e53935' }}>
                            <ListItem button name='statistics' onClick={handleNavClick}>
                                <ListItemIcon><InsertChartIcon /></ListItemIcon>
                                <ListItemText primary='Statistics' />
                            </ListItem>

                            <ListItem button name='managevacations' onClick={handleNavClick}>
                                <ListItemIcon><ListAltIcon /></ListItemIcon>
                                <ListItemText primary="Manage Vacations" />
                            </ListItem>

                            <ListItem button name='manageorders' onClick={handleNavClick}>
                                <ListItemIcon><AddShoppingCartIcon /></ListItemIcon>
                                <ListItemText primary="Manage Orders" />
                            </ListItem>

                            <ListItem button name='manageusers' onClick={handleNavClick}>
                                <ListItemIcon><GroupIcon /></ListItemIcon>
                                <ListItemText primary="Manage Users" />
                            </ListItem>
                        </List>
                    }
                    <Divider />
                    <List className={classes.footernav}>
                        <ListItem button name='profile' onClick={handleNavClick}>
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary='Profile' />
                        </ListItem>

                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon><ExitToAppIcon style={{ fill: '#e53935' }} /></ListItemIcon>
                            <ListItemText style={{ color: '#e53935' }} primary='Log out' />
                        </ListItem>
                    </List>
                </Drawer>
            </nav>
    );

}

export default Nav
