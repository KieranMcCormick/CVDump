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
                filename:newNotice.filename,
                content: newNotice.content,
                type:newNotice.type,
                timeStamp: newNotice.timeStamp,
                sender: newNotice.sender,
                uuid: newNotice.uuid,
            })
            console.log(newNotice)
            return newState
        case types.RESOLVE_NOTIFICATION:
             let id = action.payload.removed
             state = state.filter((notice) =>{return notice.uuid !=id}) 
             return state
                         
        default:
            return state
    }
}
