import { combineReducers, } from "redux"
import { routerReducer as routing, } from "react-router-redux"

// combined reducer
export const reducer = combineReducers({
    routing,
})

export const initialState = {}
