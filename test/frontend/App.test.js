import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import App from '../../src/app/js/containers/App'

const mockStore = configureStore([thunk])
let store

beforeEach(()=>{
    store = mockStore({
        app: {
            files: [],
            selectedFile: {
                id: '',
                availableBlocks: [],
                blocks: [],
            },
            form: {
                errorMessage: '',
            }
        },
        form: reduxFormReducer,
        user: {
            isFetching: false,
            isAuthenticated: false,
            errorMessage: '',
            info: {
                username: '',
                email: '',
                firstname: '',
                lastname: '',
            },
        },
        routing,
    })
})

it('renders without crashing', () => {
    ReactDOM.render(
        <Provider store={store}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>
        , document.createElement('div')
    )
})
