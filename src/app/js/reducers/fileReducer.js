import types from '../actions/types'
import _ from 'lodash'

const initState = []

export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_FILES_SUCCESS: {
            const files = [...action.payload.files]
            return files
        }
        case types.FETCH_FILES_FAILURE:
            return []
        case types.FETCH_FILE_SUCCESS: {
            const files = _.map(state).map(file => {
                if (file.id === action.paylod.id) {
                    return action.payload
                } else {
                    return file
                }
            })
            return files
        }
        case types.FETCH_FILE_FAILURE:
            return state
        default:
            return state
    }
}
