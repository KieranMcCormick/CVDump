import axios from 'axios'
import types from './types'
import { push } from 'react-router-redux'
import SocketHandler from '../global/socketsHandler'

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
        const res = await axiosWithCSRF.post('/login', { username, password })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: res.data,
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
        const res = await axios.get('/files')
        dispatch({
            type: types.FETCH_FILES_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_FILES_FAILURE,
            payload: error.data,
        })
    }
}

//THIS SHOULD BE CHANGED TO SHARED FILES ENDPOINT
export const dispatchFetchFile = (id, callback) => async (dispatch) => {
    try {

        //IN PROGRESS DO NOT TOUCH UNLESS YOU ARE SELEENA
        const comment = await axios.get(`/comment/${id}`)
        //const pdf = await axios.get(`/files/pdf/${id}`)

        dispatch({
            type: types.FETCH_FILE_SUCCESS,
            payload: {
                doc_id: id,
                version: 1,
                comments: comment.data,
                blocks: [ //after changed to shared page this should not be here
                    '__markdown__ *format*'
                ],
            },
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_FILE_FAILURE,
            payload: error.data,
        })
        callback()
    }
}


export const dispatchCreateComment = (comment) => async (dispatch) => {
    try {

        axiosWithCSRF.post('/comment/create', comment)
        dispatch({
            type: types.CREATE_COMMENT_SUCCESS,
            payload: {
                id: comment.docId,
                comment,
            },
        })
        SocketHandler.emitEvent(
            'comments',
            'comment',
            {
                roomId: comment.docId,
                comment,
            }
        )
    } catch (error) {
        console.error(error)
    }
}


export const dispatchReceiveComment = (comment) => ({
    type: types.RECEIVE_COMMENT,
    payload: {
        id: comment.docId,
        comment,
    },
})

export const dispatchCreateFile = () => async (dispatch) => {
    try {
        const res = await axios.get('/files/create')

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

// export const dispatchSavePdf = (id) => async (dispatch) => {
//     try {
//         const res = await axios.get('/files/savepdf/${id}')

//         dispatch({
//             type: types.FETCH_FILE_SUCCESS,
//             payload: res.data,
//         })
//     } catch (error) {
//         dispatch({
//             type: types.FETCH_FILE_FAILURE,
//             payload: error.data,
//         })
//     }
// }

// export const dispatchGetPdf = (id) => async (dispatch) => {
//     try {
//         const res = await axios.get('/file/pdf/${id}')

//         dispatch({
//             type: types.FETCH_FILE_SUCCESS,
//             payload: res.data,
//         })
//     } catch (error) {
//         dispatch({
//             type: types.FETCH_FILE_FAILURE,
//             payload: error.data,
//         })
//     }
// }

