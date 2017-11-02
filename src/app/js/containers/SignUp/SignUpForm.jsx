import React, { Component, PureComponent } from 'react'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import formFields from './formFields'
import { validateEmail } from '../../global/validateEmail'


/**
 * Login Field
 * @param {*} label: label for the input
 * @param {*} input: event handlers
 * @param {*} type: input element's type
 * @param {*} autoComplete: input element's attribute
 * @param {*} meta: meta info of the input field from redux-form
 */
class SignUpField extends PureComponent {
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
                />
            </div>
        )
    }
}

SignUpField.propTypes = {
    label: PropTypes.string.isRequired,
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    autoComplete: PropTypes.string.isRequired,
    meta: PropTypes.object,
}

class SignUpForm extends Component {
    render() {
        return (
            <div>
                <form className="c-signup-form" onSubmit={this.props.handleSubmit(this.props.onSignUpSubmit)}>
                    {formFields.map(({ name, type, label, autoComplete }) => (
                        <Field
                            key={`signup-field-${name}`}
                            name={name}
                            type={type}
                            component={SignUpField}
                            label={label}
                            autoComplete={autoComplete}
                        />
                    ))}
                    <RaisedButton type="submit" className="u-margin-v-md u-full-width">Create an account</RaisedButton>
                    <div className="u-padding-v-md">
                        <span>Already a member?</span>
                        <Link to="/login" className="u-padding-h-md">
                            Login Here
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}

SignUpForm.propTypes = {
    onSignUpSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
}

SignUpField.defaultProps = {
    onSignUpSubmit: () => {},
}

const validate = (values) => {
    const errors = {}

    errors.email = !validateEmail(values.email) && 'You must provide a valid email'

    _.each(formFields, ({ name }) => {
        if (!errors[name] && !values[name]) {
            errors[name] = 'You must provide a value'
        }
    })
    if (!errors.username && values.username.length <= 3) {
        errors.username = 'Username length must be greater than 3'
    } else if (!errors.password && values.password.length <= 5) {
        errors.password = 'Password length must be greater than 5'
    }

    return errors
}

// allows the form to connect the redux stores
export default reduxForm({
    validate,
    form: 'signUpForm',
})(SignUpForm)
