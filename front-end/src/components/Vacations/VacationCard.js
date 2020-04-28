import React, { useContext } from 'react';
import clsx from 'clsx';
import './VacationCard.css';
import { Context } from '../../stores/globalStore';

import { makeStyles } from '@material-ui/core/styles';

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Collapse,
    Paper,
    Divider
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

/* Imported Icons */
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    cardStyle: {
        display: 'block',
        width: '20vw',
        transitionDuration: '0.3s',
    },
    paperStyle: {
        marginBottom: '1rem',
        backgroundColor: '#3f51b5',
        color: '#fff'
    },
    dateTypograhpyStlye: {
        fontWeight: '500',
        fontSize: '1.1rem',
        marginTop: '0.3rem',
        marginBottom: '0.3rem',
    },
    dividerStyle: {
        marginBottom: '1rem'
    },
}));


const VacationCard = (props) => {
    const [state, dispatch] = useContext(Context);

    let endDate = new Date(Date.parse(props.vacation.EndDate))
    endDate = endDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });

    let startDate = new Date(Date.parse(props.vacation.StartDate))
    startDate = startDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleAddClick = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:8000/vacations/' + props.vacation.id + '/add', {}, {
            withCredentials: true,
            credentials: 'include',
        })
            .then((response) => {
                dispatch({type: 'ADD_VACATION_TO_USER', payload: props.vacation})
            })
            .catch((error) => {
            });
    }

    const userHasVacation = () => {
        const vacationIndex = state.userStatus.userVacations.findIndex(vacation => vacation.vacationId === props.vacation.id)
        if (vacationIndex !== -1) return true
        else return false
    }

    return (
        !state.userStatus.userType ? '' :
            <Box
                m={1}
                display="flex"
                alignSelf='flex-start'
            >
                <Card
                    className={classes.cardStyle}
                >
                    <CardActionArea>
                        <Paper
                            className={classes.paperStyle}
                        >
                            <Box
                                display='flex'
                                justifyContent='center'
                                component="div">
                                <Typography
                                    className={classes.dateTypograhpyStlye}
                                    variant="h6"
                                    component="h1"
                                >
                                    {startDate} - {endDate}
                                </Typography>
                            </Box>
                        </Paper>
                        <CardMedia
                            component="img"
                            alt={props.vacation.name + ' picture'}
                            height="140"
                            image={props.vacation.image}
                            title={props.vacation.name + ' picture'}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                {props.vacation.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>

                    <CardActions
                        disableSpacing
                    >
                        {userHasVacation() ?
                            <IconButton disabled>
                                <CheckIcon />
                            </IconButton>
                            :
                            <IconButton
                                onClick={handleAddClick}
                                aria-label="add to your vacations"
                            >
                                <AddIcon />
                            </IconButton>
                        }

                        <IconButton
                            aria-label="share"
                        >
                            <ShareIcon />
                        </IconButton>

                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>

                    </CardActions>

                    <Collapse
                        in={expanded}
                        timeout="auto"
                        unmountOnExit
                    >
                        <CardContent>
                            <Typography paragraph>
                                <b>Starting at</b> {props.vacation.price} $
                        </Typography>

                            <Divider className={classes.dividerStyle} />

                            <Typography paragraph>
                                {props.vacation.description}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </Box >
    );
}

export default VacationCard

