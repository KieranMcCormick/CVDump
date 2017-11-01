import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import userReducer from './userReducer'
import signUpReducer from './signUpReducer'

export const initialState = {}

// define app-level reducer
const appReducer = combineReducers({
    signup: signUpReducer,
})

// combined reducer
export default combineReducers({
    app: appReducer,
    form: formReducer,
    user: userReducer,
    routing,
})
