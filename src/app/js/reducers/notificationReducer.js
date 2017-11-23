import types from '../actions/types'

const initState = {
    notifications:[],
}

export default (state = initState, action) => {
    switch(action.type) {
        case types.FETCH_NOTIFICATION_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case types.SEND_NOTIFICATION_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case types.SPAWN_NOTIFICATION:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
