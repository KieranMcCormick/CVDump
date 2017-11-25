import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Tabs, Tab } from '../components/Tabs'
import NotFound from '../components/NotFound'
import Home from './Home'
import File from '../components/File'
import ShareFile from '../components/ShareFile'
import FilesView from './FilesView'
import SharesView from './SharesView'
import BlocksView from './BlocksView'
import HistoryView from './HistoryView'
import StatusBar from './StatusBar'
import * as actions from '../actions'

const routes = [
    {
        path: '/',
        label: 'Home',
        exact: true,
        component: Home,
    },
    {
        path: '/files',
        label: 'Files',
        component: FilesView,
    },
    {
        path: '/shares',
        label: 'Shares',
        component: SharesView,
    },
    {
        path: '/blocks',
        label: 'Blocks',
        component: BlocksView,
    },
    {
        path: '/history',
        label: 'History',
        component: HistoryView,
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
                <StatusBar />
                <div className="t-tab-tabbar">
                    <Tabs startIndex={this.state.tabIndex}>{this.renderTabBar()}</Tabs>
                </div>
                <Switch>
                    <Route path="/files/:id" component={File} />
                    <Route path="/shared/:id" component={ShareFile} />
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
