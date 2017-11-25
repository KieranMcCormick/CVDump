import types from '../actions/types'

const initState = []


export default (state = initState, action) => {
    switch(action.type) {
        case types.FETCH_NOTIFICATION_SUCCESS:
            const notices = [...action.payload]
            return  [...action.payload.notifications]
            
        case types.SEND_NOTIFICATION_SUCCESS:  
            console.log("notification sent");
            return state
               
            
        //when notification comes this way, update the global notifications array    
        case types.RECEIVE_NOTIFICATION:
     
            let newNotice = action.payload.newNotice
            let newState = [ ...state ]
            newState.push({
                document_id:newNotice.documentId,
                type:newNotice.type,
                timeStamp: newNotice.timeStamp,
            })
            console.log(newState)
            return newState
        default:
            return state
    }
}
