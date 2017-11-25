import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import userReducer from './userReducer'
import signUpReducer from './signUpReducer'
import fileReducer from './fileReducer'
import selectedFileReducer from './selectedFileReducer'
import formReducer from './formReducer'
import sharedFilesReducer from './sharedFilesReducer'
import notificationReducer from './notificationReducer'

export const initialState = {}

// define app-level reducer
const appReducer = combineReducers({
    signup: signUpReducer,
    files: fileReducer,
    selectedFile: selectedFileReducer,
    form: formReducer,
    sharedFiles: sharedFilesReducer,
    notifications: notificationReducer,
})

// combined reducer
export default combineReducers({
    app: appReducer,
    form: formReducer,
    user: userReducer,
    routing,
})
