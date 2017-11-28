import axios from 'axios'
import types from './types'
import { push } from 'react-router-redux'
import SocketHandler from '../global/socketsHandler'

axios.defaults.baseURL = '/api'

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
            },
        })
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage || 'Unknown Error',
        })
        dispatch(push('/login'))
    }
}

export const dispatchSignUp = ({ username, firstname, lastname, email, password, confirmPassword }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/register', { username, firstname, lastname, email, password, confirmPassword })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
        dispatch(push('/signup'))
    }
}

export const dispatchClearFormError = () => ({
    type: types.FORM_ERROR_CLEAR,
})

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
            payload: error.response.data,
        })
    }
}


// export const dispatchFetchFileWithVersion = () => async(dispatch) => {
//     try {

//     } catch (error) {

//     }
// }

// collections
export const dispatchFetchSharedFiles = (callback) => async (dispatch) => {
    try {

        //IN PROGRESS DO NOT TOUCH UNLESS YOU ARE SELEENA
        // const res = await axios.get('/shared')
        // dispatch({
        //     type: types.FETCH_SHARES_SUCCESS,
        //     payload: res.data,
        // })

        // mocking the data here
        const res = await axios.get('/files')
        dispatch({
            type: types.FETCH_SHARES_SUCCESS,
            payload: res.data,
        })
        // expected objects
        // dispatch({
        //     type: types.FETCH_SHARES_SUCCESS,
        //     payload: {
        //         files: [
        //             {
        //                 user_id: 'userId',
        //                 doc_id: 'asdasd',
        //                 title: 'asdeasdasdasdasda',
        //             }
        //         ],
        //     },
        // })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_SHARES_FAILURE,
            payload: error.response.data,
        })
        callback()
    }
}


// single file
export const dispatchFetchSharedFile = (id, callback) => async (dispatch) => {
    try {

        //IN PROGRESS DO NOT TOUCH UNLESS YOU ARE SELEENA
        const comment = await axios.get(`/comment/${id}`)
        const pdf = await axios.get(`/files/pdf/${id}`)

        dispatch({
            // TODO: CHANGE THE ACTION TYPE
            type: types.FETCH_SHARE_FILE_SUCCESS,
            payload: {
                comments: comment.data,
                pdf: pdf.data,
            },
        })
        callback()
    } catch (error) {
        dispatch({
            // TODO: CHANGE THE ACTION TYPE
            type: types.FETCH_FILE_FAILURE,
            payload: error.response.data,
        })
        callback()
    }
}


export const dispatchFetchFile = (id, callback) => async (dispatch) => {
    try {
        // this could be triggered during a new document creation
        // const doc = id
        //     ? await axios.get(`/files/${id}`)
        //     : {
        //         data: {
        //             version: 0,
        //             title: '',
        //             blocks: [],
        //         },
        //     }
        // const availableBlocks = await axios.get('/blocks')

        dispatch({
            type: types.FETCH_FILE_SUCCESS,
            payload: {
                // not sure if version is needed anymore, remove if not
                // version: doc.data.version,
                // title: doc.data.title,
                // blocks: doc.data.blocks,
                title: '',
                blocks: [],
                // availableBlocks: availableBlocks.data,
                availableBlocks: [
                    {
                        block_id: 'asdfasdfasdf',
                        summary: '1. 23123 2. 123123',
                    },
                    {
                        block_id: 'asdfasdfasdf',
                        summary: '__markdown__ **format** 1. 23123 2. 123123',
                    }
                ],
            },
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_FILE_FAILURE,
            payload: error.response.data,
        })
        callback()
    }
}

export const dispatchSelectFile = (id, title) => ({
    type: types.SELECT_FILE,
    payload: {
        id,
        title,
    },
})

export const dispatchAddBlockToSelectedFile = (value) => ({
    type: types.ADD_BLOCK_TO_SELECTED_FILE,
    payload: value,
})

export const dispatchRemoveBlockFromSelectedFile = (blockOrder) => ({
    type: types.REMOVE_BLOCK_FROM_SELECTED_FILE,
    payload: blockOrder,
})

export const dispatchMoveBlockFromSelectedFile = (blockOrder, delta) => ({
    type: types.MOVE_BLOCK_FROM_SELECTED_FILE,
    payload: {
        blockOrder,
        delta,
    },
})

export const dispatchCreateComment = (comment) => async (dispatch) => {
    try {

        await axiosWithCSRF.post('/comment/create', comment)

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

export const dispatchOnClickCreateFile = () => ({
    type: types.CREATING_NEW_FILE,
})

export const dispatchCreateFile = ({ title /* , blocks, created_at */ }, callback) => async (dispatch) => {
    try {
        // returns the id of the newly created document
        // const res = await axios.post('/files/create', { title, blocks, created_at })

        // dispatch({
        //     type: types.CREATE_FILE_SUCCESS,
        //     payload: res.data,
        // })
        dispatch({
            type: types.CREATE_FILE_SUCCESS,
            payload: {
                title,
            },
        })

        // dispatch.push(`/files/${res.data.id}`)
        dispatch(push('sdfsdfsdfsdfsdfsdf'))

        callback('File created')
    } catch (error) {
        dispatch({
            type: types.CREATE_FILE_FAILURE,
            payload: error.response.data,
        })
        callback('File create failed')
    }
}

export const dispatchUpdateFile = (id, title, blocks, callback) => async (dispatch) => {
    try {
        // const res = await axios.post(`/files/update/${id}`, { title, blocks })
        // dispatch({
        //     type: types.UPDATE_FILE_SUCCESS,
        //     payload: res.data,
        // })
        dispatch({
            type: types.UPDATE_FILE_SUCCESS,
            payload: {
                title,
            },
        })
        callback('File updated')
    } catch (error) {
        dispatch({
            type: types.UPDATE_FILE_FAILURE,
            payload: error.response.data,
        })
        callback('File update failed')
    }
}


export const dispatchLogOut = () => async (dispatch) => {
    try {
        await axiosWithCSRF.post('/logout')

        dispatch({
            type: types.LOGOUT,
            payload: {
                isAuthenticated: false,
                info: {},
            },
        })
    } catch (error) {
        // Unknown error
        console.error(error)
        dispatch(push('/'))
    }
}


export const dispatchUpdate = ({ email, firstname, lastname }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/users/profile', { email, firstname, lastname })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
        dispatch(push('/profile'))
    }
}

export const dispatchUpdatePassword = ({ currentPassword, password, confirmPassword }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/users/updatePassword', { currentPassword, password, confirmPassword })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
        dispatch(push('/profile'))
    }
}


// export const dispatchUpdateDocTitle = (id) => async (dispatch) => {
//     try {
//         const res = await axios.get(`/files/update/${id}`)

//         dispatch({
//             type: types.UPDATE_FILE_SUCCESS,
//             payload: res.data,
//         })
//     } catch (error) {
//         dispatch({
//             type: types.UPDATE_FILE_FAILURE,
//             payload: error.response.data,
//         })
//     }
// }

export const dispatchSavePdf = (id) => async (dispatch) => {
    try {
        //5479dcaf-cce6-11e7-810c-000c291b6367
        const res = await axios.get(`/files/savepdf/${id}`)

        dispatch({
            type: types.FETCH_PDF_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_PDF_FAILURE,
            payload: error.response.data,
        })
    }
}

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
//             payload: error.response.data,
//         })
//     }
// }
