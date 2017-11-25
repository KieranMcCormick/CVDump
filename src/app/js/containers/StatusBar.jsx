import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Logo, Avatar } from '../global/icon'
import * as actions from '../actions'
import PathLink from '../components/PathLink'
import { Paper, Menu, MenuItem } from 'material-ui'
import { getDisplayName } from '../global/common'


class StatusBar extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            showMenu: false,
        }
    }

    renderLogo() {
        return (
            <Link className="c-status-bar__logo" to="/">
                <Logo style={{ width: '65px', height: 'auto' }} />
            </Link>
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
    dispatchLogOut: PropTypes.func.isRequired,
}


const mapStateToProps = ({ user,app }) => ({
    user,
    notifications: app.notifications,
})


export default withRouter(connect(mapStateToProps,actions)(StatusBar))
