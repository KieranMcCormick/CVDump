import React from "react"
import ReactDOM from "react-dom"
import { Provider, } from "react-redux"
import { Router, } from "react-router"
import { createBrowserHistory, } from "history"
import store from "./store"
import App from "./containers/App"

// ServiceWorker.register()

const history = createBrowserHistory()

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
    , document.getElementById("app"))
