import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../actions'
import SignUpForm from './SignUpForm'
import { Logo } from '../../global/icon'

class SignUp extends Component {
    render() {
        const { signUpFail, errorMessage } = this.props.signup
        return (
            <div className="u-flex-column u--center-cross u-full">
                <Logo style={{width: '150px', height: 'auto'}} />
                <h2>Please fill the form to register</h2>
                {signUpFail && <span className="u-fail-text">{errorMessage}</span>}
                <SignUpForm
                    onSignUpSubmit={() => this.props.dispatchSignUp(this.props.form.values)}
                />
            </div>
        )
    }
}

SignUp.propTypes = {
    dispatchSignUp: PropTypes.func.isRequired,
    form: PropTypes.object,
    signup: PropTypes.shape({
        signUpFail: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string.isRequired,
    }),
}

SignUp.defaultProps = {
    dispatchSignUp: () => {},
}

const mapStateToProps = (state) => ({
    form: state.form.signUpForm,
    signup: state.app.signup,
})

export default connect(mapStateToProps, actions)(SignUp)
