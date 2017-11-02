import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


class Landing extends Component {
    render() {
        const { info } = this.props.user
        return (
            <div>
                <div>
                    Your user info here
                </div>
                <ul>
                    <li>username: {info.username}</li>
                    <li>email: {info.email}</li>
                    <li>firstname: {info.firstname}</li>
                    <li>lastname: {info.lastname}</li>
                </ul>
            </div>
        )
    }
}

Landing.propTypes = {
    user: PropTypes.object,
}

const mapStateToProps = (state) => ({
    user: state.user,
})


export default connect(mapStateToProps, null)(Landing)
