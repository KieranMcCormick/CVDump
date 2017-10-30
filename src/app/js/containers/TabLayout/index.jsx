import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Tabs, Tab } from '../../components/Tabs'
import NotFound from '../../components/NotFound'
import Landing from '../Landing'
import Files from '../Files'
import Shares from '../Shares'
import Blocks from '../Blocks'
import History from '../History'
import * as actions from '../../actions'

const routes = [
    {
        path: '/',
        label: 'Home',
        exact: true,
        component: Landing,
    },
    {
        path: '/files',
        label: 'Files',
        component: Files,
    },
    {
        path: '/shares',
        label: 'Shares',
        component: Shares,
    },
    {
        path: '/blocks',
        label: 'Blocks',
        component: Blocks,
    },
    {
        path: '/history',
        label: 'History',
        component: History,
    }
]

class TabLayout extends Component {
    constructor() {
        super()

        this.state = {
            tabIndex: 0,
        }
    }

    componentWillMount() {
        const index = routes.findIndex((item) => {
            return item.path === this.props.location.pathname
        })
        if (index !== -1) {
            this.setState({ tabIndex: index })
        }
    }

    renderTabBar() {
        return routes.map(({ path, label }) => {
            return <Tab key={`Nav-tab-${label}`} path={path} label={label} />
        })
    }
    render() {
        return (
            <div className="u-flex-column u--center-cross u-full">
                <Tabs startIndex={this.state.tabIndex}>{this.renderTabBar()}</Tabs>
                <Switch>
                    {routes.map(({ path, component, exact, label })=> {
                        return <Route key={`routes-${label}`} path={path} component={component} exact={exact} />
                    })}
                    <Route path="*" component={ NotFound } />
                </Switch>
            </div>
        )
    }
}

TabLayout.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
}

export default withRouter(connect(null, actions)(TabLayout))
