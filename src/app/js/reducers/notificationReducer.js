import types from '../actions/types'

const initState = []


export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_NOTIFICATION_SUCCESS:
            const notices = [...action.payload]
            return [...action.payload]

        case types.SEND_NOTIFICATION_SUCCESS:
            return state

        case types.RECEIVE_NOTIFICATION:
            let newNotice = action.payload.newNotice
            let newState = [newNotice, ...state]
            return newState
        case types.RESOLVE_NOTIFICATION:
            let id = action.payload.removed
            state = state.filter((notice) => { return notice.uuid != id })
            return state
        default:
            return state
    }
}
