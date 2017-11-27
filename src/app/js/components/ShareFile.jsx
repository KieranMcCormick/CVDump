import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import Loader from './Loader'
import CommentBox from '../containers/comments/CommentBox'
// import { Document, Page } from 'react-pdf'

/**
 * FILE NOT READY
 */

class ShareFile extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            numPages: 1,
            pageNumber: 1,
        }
    }

    componentDidMount() {
        const id = this.getDocumentId()
        this.props.dispatchFetchSharedFile(id, () => {
            this.setState({ isLoading: false })
        })
    }

    getDocumentId() {
        // if user refresh on the file, then selectedFile would be empty
        const lastIndex = this.props.location.pathname.lastIndexOf('/')
        return this.props.selectedFile.id || this.props.location.pathname.substring(lastIndex + 1)
    }

    onDocumentLoad({ numPages }) {
        this.setState({
            numPages,
            isLoading: false,
        })
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        const { pageNumber, numPages } = this.state
        return (
            <div className="c-file-container">
                <div className="c-file-content">
                    <h3>View Your Resume Here</h3>
                    {/* Remove when endpoints are ready
                        <Document
                        file={this.props.selectedFile.pdf}
                        onLoadSuccess={this.onDocumentLoad}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document> */}
                    <p>Page {pageNumber} of {numPages}</p>
                </div>
                <div className="c-file-comments">
                    <h3>Your Comments</h3>
                    <CommentBox docId={this.getDocumentId()} />
                </div>
            </div>
        )
    }
}

ShareFile.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    dispatchFetchSharedFile: PropTypes.func.isRequired,
    selectedFile: PropTypes.shape({
        id: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        pdf: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = ({ app }) => ({
    selectedFile: app.selectedFile,
})


export default withRouter(connect(mapStateToProps, actions)(ShareFile))
