import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'

class ExternalAuthButton extends PureComponent {
    openExternalAuth() {
        window.location = this.props.path
    }

    render() {
        return (
            <RaisedButton
                backgroundColor={this.props.color}
                className="u-margin-v-md u-full-width"
                icon={this.props.icon}
                label={this.props.label}
                labelColor={this.props.labelColor}
                onClick={this.openExternalAuth.bind(this)}
            />
        )
    }
}

ExternalAuthButton.propTypes = {
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    labelColor: PropTypes.string,
    icon: PropTypes.element,
}

export default ExternalAuthButton
