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
            console.log("notification sent");
            return {
                ...state,
                ...action.payload,
            }
        //when notification comes this way, update the global notifications array    
        case types.RECEIVE_NOTIFICATION:
            console.log("RECEIVED NOTIFICATION");
            console.log(state);
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
