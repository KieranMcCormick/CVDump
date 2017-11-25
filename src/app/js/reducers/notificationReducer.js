import types from '../actions/types'

const initState = []


export default (state = initState, action) => {
    switch(action.type) {
        case types.FETCH_NOTIFICATION_SUCCESS:
            const notices = [...action.payload.notifications]
            return notices
                
            
        case types.SEND_NOTIFICATION_SUCCESS:  
            console.log("notification sent");
            return {
                ...state,
            }
        //when notification comes this way, update the global notifications array    
        case types.RECEIVE_NOTIFICATION:
            console.log("RECEIVED NOTIFICATION");
            console.log(state);
            console.log(action.payload);
            let newState = [ ...state ]
            newState.push(action.payload.newNotice)
            console.log(newState)
            return newState
        default:
            return state
    }
}
