import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import ShareBlock from '../components/ShareBlock'


class SharedView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
        }
    }
    componentDidMount() {
        this.props.dispatchFetchSharedFiles(() => this.setState({ isLoading: false }))
    }

    renderSharedWith() {
        const userId = this.props.user.info.userId
        const files = this.props.sharedFiles.filter(({ user_id }) => userId !== user_id )
        return files.map(({doc_id, title}, index) => (
            <ShareBlock
                key={`file-block-shared-with-${index}`}
                id={doc_id}
                name={title}
            />
        ))
    }

    renderSharedTo() {
        const userId = this.props.user.info.userId
        const files = this.props.sharedFiles.filter(({ user_id }) => userId === user_id )
        return files.map(({doc_id, title}, index) => (
            <ShareBlock
                key={`file-block-shared-to-${index}`}
                id={doc_id}
                name={title}
            />
        ))
    }

    render() {
        return (
            <div className="c-shares-view-container">
                <h2>Files Shared with Me</h2>
                <div className="c-shares-view__files-list">
                    {this.renderSharedWith()}
                </div>
                <h2>Files I Shared with People</h2>
                <div className="c-shares-view__files-list">
                    {this.renderSharedTo()}
                </div>
            </div>
        )
    }
}

SharedView.propTypes = {
    user: PropTypes.shape({
        info: PropTypes.shape({
            userId: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    sharedFiles: PropTypes.arrayOf(PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    dispatchFetchSharedFiles: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app, user }) => ({
    sharedFiles: app.sharedFiles,
    user,
})

export default connect(mapStateToProps, actions)(SharedView)
