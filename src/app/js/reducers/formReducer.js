import types from '../actions/types'

const initState = {
    errorMessage: '',
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.FORM_ERROR:
            return {
                errorMessage: action.payload,
            }
        case types.FORM_ERROR_CLEAR:
            return {
                errorMessage: '',
            }
        default:
            return state
    }
}
