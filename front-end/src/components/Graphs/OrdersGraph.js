import React, { useEffect, useReducer } from 'react'
import CanvasJSReact from './canvasjs.react';
import axios from 'axios'
import ordersGraphReducer from '../../reducers/ordersGraphReducer'
import { Container, CssBaseline } from '@material-ui/core'

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const OrdersGraph = (props) => {
    const initialState = {
        error: false,
        data: []
    };

    const [state, dispatch] = useReducer(ordersGraphReducer, initialState);

    useEffect(() => {
        axios.get('http://localhost:8000/admin/statistics', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                dispatch({ type: 'SET_DATA', payload: response.data.data })
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR' })
            });

    }, [])

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", 
        title: {
            text: "Orders Statistics"
        },
        data: [{
            type: props.type,
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: state.data.map(data => {
                return { label: data.VacationName, y: data.OrderCount }
            })
        }]
    }

    return (
        <Container component="div" maxWidth="lg" style={{marginBottom: '3rem', marginTop: '2rem'}}>
            <CssBaseline />
            <CanvasJSChart options={options} />
        </Container>
    );

}

export default OrdersGraph;