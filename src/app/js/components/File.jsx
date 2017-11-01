import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import CommentBox from '../containers/comments/CommentBox'


class File extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        // TODO: Uncomment for markdown integration
        // this.props.dispatchFetchFile(this.props.match.params)
    }

    render() {
        return (
            <div className="c-file">
                This is per file view
                <CommentBox currentDoc="1" />
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
