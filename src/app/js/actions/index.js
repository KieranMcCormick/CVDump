import axios from 'axios'
import types from './types'
import { push } from 'react-router-redux'

const axiosWithCSRF = axios.create({
    xsrfCookieName: '_csrfToken',
})

export const dispatchFetchUser = (redirectPath, originalPath) => async (dispatch) => {
    try {
        dispatch({
            type: types.FETCH_REQUEST,
            payload: {
                isFetching: true,
            },
        })

        const res = await axios.get('/currentUser')
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: res.data,
            },
        })
        dispatch(push(redirectPath))
    } catch (error) {
        dispatch({
            type: types.FETCH_FAILURE,
            payload: {
                isFetching: false,
                isAuthenticated: false,
            },
        })
        if (originalPath !== '/login' && originalPath !== '/signup') {
            dispatch(push('/login'))
        }
    }
}

export const dispatchLogin = ({ username, password }) => async (dispatch) => {
    try {
        /* const res = await axiosWithCSRF.post('/login', { username, password })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: res.data,
            },
        }) */
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: { username: 'asdfadf' },
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.LOGIN_FAILURE,
            payload: {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: error.response.data.errorMessage || 'Unknown Error',
            },
        })
        dispatch(push('/login'))
    }
}

export const dispatchSignUp = ({ username, email, password, confirmPassword }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/register', { username, email, password, confirmPassword })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.SIGNUP_FAILURE,
            payload: {
                errorMessage: error.response.data.errorMessage,
            },
        })
        dispatch(push('/signup'))
    }
}

export const dispatchFetchFiles = () => async (dispatch) => {
    try {
        // Mock data remove later
        // const res = await axios.get('/files')
        // dispatch({
        //     type: types.FETCH_FILES_SUCCESS,
        //     payload: res.data,
        // })
        dispatch({
            type: types.FETCH_FILES_SUCCESS,
            payload: [
                {
                    id: 1,
                    name: 'File name 1',
                },
                {
                    id: 2,
                    name: 'File name 2',
                },
                {
                    id: 3,
                    name: 'File name 3',
                }
            ],
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_FILES_FAILURE,
            payload: error.data,
        })
    }
}

export const dispatchFetchFile = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/files/${id}`)

        dispatch({
            type: types.FETCH_FILE_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_FILE_FAILURE,
            payload: error.data,
        })
    }
}
