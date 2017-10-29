import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as actions from '../../actions'
import Login from '../Login'
import SignUp from '../SignUp'  
import TabLayout from '../TabLayout'
import Loader from '../../components/Loader'

class App extends Component {
    componentDidMount() {
        // check if the user is authenticated already
        const originalPath = this.props.location.pathname
        const redirectPath = originalPath === '/login' || originalPath === '/signup'
            ? '/'
            : originalPath
        this.props.dispatchFetchUser(redirectPath)
    }

    render() {
        if (this.props.user.isFetching) {
            return (
                <div className="u-flex-row u--center u-full">
                    <Loader />
                </div>
            )
        }

class App extends Component {
    
    render() {
        return (
            <div className="app">
                <MuiThemeProvider>
                    <Switch>
                        <Route exact path="/login" component={ Login } />
                        <Route exact path="/signup" component={ SignUp } />
                        <Route path="/" component={TabLayout} />
                        <Redirect path="*" to="/" />
                    </Switch>
                </MuiThemeProvider>

                <header className="app-header">
                    <h1> Welcome to our resume builder </h1>
                   
                </header>
                <CommentBox></CommentBox>
            </div>
        )
    }
}

App.propTypes = {
    user: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
    }),
    dispatchFetchUser: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = ({ user }) => ({
    user,
})

export default withRouter(connect(mapStateToProps, actions)(App))
