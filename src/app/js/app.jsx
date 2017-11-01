import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { store, history } from './store'
import App from './containers/App'
import 'material-design-icons/iconfont/material-icons.css'

// ServiceWorker.register()


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
    , document.getElementById('app'))
