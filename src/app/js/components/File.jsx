import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import CommentBox from '../containers/comments/CommentBox'
import Loader from './Loader'


class File extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        this.props.dispatchFetchFile(this.props.match.params.id, () => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div className="c-file">
                This is per file view
                <CommentBox docId={this.props.match.params.id} />
            </div>
        )
    }
}

File.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    dispatchFetchFile: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app }) => ({
    files: app.files,
})


export default connect(mapStateToProps, actions)(File)
