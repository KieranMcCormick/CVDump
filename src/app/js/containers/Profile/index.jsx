import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../actions'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import StatusBar from '../StatusBar'
import { Avatar } from '../../global/icon'
import { getDisplayName } from '../../global/common'

class Profile extends Component {
    componentWillUnmount() {
        this.props.dispatchClearFormError()
    }

    render() {
        const {
            user,
            formMessage: { errorMessage },
            profileForm,
            passwordForm,
        } = this.props
        const initialValues = {
            email: user.info.email,
            firstname: user.info.firstname,
            lastname: user.info.lastname,
        }
        return (
            <div className="u-flex-column u--center-cross u-full">
                <StatusBar />
                <Avatar
                    url={user.info.avatarUrl}
                    style={{ width: 100, height: 'auto', margin: '25px'}}
                />
                <p className="u-font--size-lg">
                    Hello <strong>{getDisplayName()}</strong>, you can update your info here
                </p>
                {errorMessage && <span className="u-fail-text">{errorMessage}</span>}
                <div className="u-flex-row u--space-around u-full-width u-padding-lg">
                    <ProfileForm
                        className="u-half-width"
                        onUpdateSubmit={() => this.props.dispatchUpdate(profileForm.values)}
                        initialValues={initialValues}
                    />
                    <PasswordForm className="u-half-width" onUpdateSubmit={() => this.props.dispatchUpdatePassword(passwordForm.values)} />
                </div>
            </div>
        )
    }
}

Profile.propTypes = {
    dispatchUpdate: PropTypes.func.isRequired,
    dispatchUpdatePassword: PropTypes.func.isRequired,
    dispatchClearFormError: PropTypes.func.isRequired,
    profileForm: PropTypes.object,
    passwordForm: PropTypes.object,
    formMessage: PropTypes.shape({
        errorMessage: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
        info: PropTypes.shape({
            username: PropTypes.string,
            email: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string.isRequired,
        }),
    }),
}

const mapStateToProps = (state) => ({
    user: state.user,
    profileForm: state.form.profileForm,
    passwordForm: state.form.passwordForm,
    update: state.app.update,
    formMessage: state.app.form,
})

export default connect(mapStateToProps, actions)(Profile)
