import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../actions'
import LoginForm from './LoginForm'
import { Logo } from '../../global/icon'


class Login extends Component {
    render() {
        const { isAuthenticated, errorMessage } = this.props.user
        return (
            <div className="u-flex-column u--center-cross u-full">
                <Logo style={{width: '150px', height: 'auto'}} />
                <h2>Please login before use</h2>
                {!isAuthenticated && errorMessage && <span className="u-fail-text">{errorMessage}</span>}
                <LoginForm onLoginSubmit={() => this.props.dispatchLogin(this.props.form.values)} />
            </div>
        )
    }
}

Login.propTypes = {
    dispatchLogin: PropTypes.func.isRequired,
    form: PropTypes.object,
    user: PropTypes.shape({
        isAuthenticated: PropTypes.bool,
        errorMessage: PropTypes.string,
    }).isRequired,
}

const mapStateToProps = (state) => ({
    form: state.form.loginForm,
    user: state.user,
})

export default connect(mapStateToProps, actions)(Login)
