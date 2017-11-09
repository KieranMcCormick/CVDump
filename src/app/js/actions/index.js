// import axios from 'axios'
import types from './types'
import { push } from 'react-router-redux'

export const dispatchFetchUser = (redirectPath) => async (dispatch) => {
    try {
        dispatch({
            type: types.FETCH_REQUEST,
            payload: {
                isFetching: true,
            },
        })

        // TODO: uncomment once the auth route is ready
        // const res = await axios.get('/currentUser')
        // dispatch({
        //     type: types.LOGIN_SUCCESS,
        //     payload: res.data,
        // })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: {
                    username: 'test',
                    firstname: 'pusheen',
                    lastname: 'cat',
                    email: 'abcd@a.ca',
                },
            },
        })
        dispatch(push(redirectPath))
    } catch (error) {
        // dispatch({
        //     type: types.FETCH_FAILURE,
        //     payload: error.data,
        // })
        dispatch({
            type: types.FETCH_FAILURE,
            payload: {
                isFetching: false,
                isAuthenticated: false,
            },
        })
        dispatch(push('/login'))
    }
}


export const dispatchLogin = (/**{ username, password }**/) => async (dispatch) => {
    try {
        // TODO: uncomment once the auth route is ready
        // const res = await axios.post('/login', { username, password })

        // dispatch({
        //     type: types.LOGIN_SUCCESS,
        //     payload: res.data,
        // })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: {
                    username: 'test',
                    firstname: 'pusheen',
                    lastname: 'cat',
                    email: 'abcd@a.ca',
                },
            },
        })
        dispatch(push('/'))
    } catch (error) {
        // dispatch({
        //     type: types.FETCH_FAILURE,
        //     payload: error.data,
        // })
        dispatch({
            type: types.LOGIN_FAILURE,
            payload: {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: 'failed to login',
            },
        })
        dispatch(push('/login'))
    }
}

export const dispatchSignUp = (/**{ username, password, email }**/) => async (dispatch) => {
    try {
        // uncomment once the auth route is ready
        // const res = await axios.post('/register', { username, password, email })

        // // register success, set the user data
        // dispatch({
        //     type: types.LOGIN_SUCCESS,
        //     payload: res.data,
        // })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: {
                    username: 'test',
                    firstname: 'pusheen',
                    lastname: 'cat',
                    email: 'abcd@a.ca',
                },
            },
        })
        dispatch(push('/'))
    } catch (error) {
        // dispatch({
        //     type: types.SIGNUP_FAILURE,
        //     payload: error.data,
        // })
        dispatch({
            type: types.SIGNUP_FAILURE,
            payload: {
                errorMessage: 'sign up failed',
            },
        })
        dispatch(push('/signup'))
    }
}
