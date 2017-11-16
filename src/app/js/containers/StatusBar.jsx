import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Logo } from '../global/icon'


class StatusBar extends PureComponent {
    renderTitle() {
        return (
            <div>
                {this.props.location.pathname}
            </div>
        )
    }

    renderLogo() {
        return (
            <div className="c-status-bar__logo">
                <Logo style={{width: '50px', height: 'auto'}} />
            </div>
        )
    }

    renderUser() {
        return (
            <div className="c-status__user">
                <label>{this.props.user.info.firstname}</label>
            </div>
        )
    }

    render() {
        return (
            <div className="c-status-bar">
                {this.renderTitle()}
                {this.renderLogo()}
                {this.renderUser()}
            </div>
        )
    }
}

StatusBar.propTypes = {
    user: PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        info: PropTypes.object.isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}


const mapStateToProps = ({ user }) => ({
    user,
})


export default withRouter(connect(mapStateToProps)(StatusBar))
