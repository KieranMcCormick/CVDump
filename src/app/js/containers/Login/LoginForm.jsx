import React, { Component, PureComponent } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import ExternalAuthButton from './ExternalAuthButton'
import formFields from './formFields'


/**
 * Login Field
 * @param {*} label: label for the input
 * @param {*} input: event handlers
 * @param {*} type: input element's type
 * @param {*} autoComplete: input element's attribute
 * @param {*} meta: meta info of the input field from redux-form
 */
class LoginField extends PureComponent {
    render() {
        const { input, label, type, autoComplete, meta: { touched, error } } = this.props
        return (
            <div className="u-flex-row u--center u-margin-v-sm">
                <TextField
                    {...input}
                    floatingLabelText={label}
                    type={type}
                    errorText={touched && error}
                    autoComplete={autoComplete}
                    fullWidth={true}
                />
            </div>
        )
    }
}

LoginField.propTypes = {
    label: PropTypes.string.isRequired,
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    autoComplete: PropTypes.string.isRequired,
    meta: PropTypes.object,
}

class LoginForm extends Component {
    render() {
        return (
            <div>
                <form className="c-login-form" onSubmit={this.props.handleSubmit(this.props.onLoginSubmit)}>
                    {formFields.map(({ name, type, label, autoComplete }) => (
                        <Field
                            key={`login-field-${name}`}
                            name={name} type={type}
                            component={LoginField}
                            label={label}
                            autoComplete={autoComplete}
                        />
                    ))}
                    <RaisedButton type="submit" className="u-margin-v-md u-full-width" label="Login" />
                    <ExternalAuthButton label="Login with CAS" path="/auth/cas/" color="#A6192E" labelColor="#fff" />
                    <ExternalAuthButton label="Login with LinkedIn" path="/auth/linkedin" color="#0077B5" labelColor="#fff" />
                    <div className="u-padding-v-md">
                        <span>New to our app?</span>
                        <Link to="/signup" className="u-padding-h-md">
                            Sign Up Here
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}

LoginForm.propTypes = {
    onLoginSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
}

LoginField.defaultProps = {
    onLoginSubmit: () => {},
}

const validate = (values) => {
    const errors = {}
    _.each(formFields, ({ name }) => {
        if (!values[name]) {
            errors[name] = 'You must provide a value'
        }
    })

    return errors
}

// allows the form to connect the redux stores
export default reduxForm({
    validate,
    form: 'loginForm',
})(LoginForm)
