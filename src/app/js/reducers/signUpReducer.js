import types from '../actions/types'

const initState = {
    signUpFail: false,
    errorMessage: '',
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.SIGNUP_FAILURE:
            return {
                signUpFail: true,
                ...action.payload,
            }
        default:
            return state
    }
}
