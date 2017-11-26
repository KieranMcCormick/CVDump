import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import Loader from './Loader'
import CommentBox from '../containers/comments/CommentBox'
import RichTextEditor from 'react-rte'

/**
 * FILE NOT READY
 */

class ShareFile extends PureComponent {
    constructor(props) {
        super(props)

        const index = this.props.files.findIndex((file) => (file.doc_id === this.props.match.params.id), this)

        this.state = {
            index,
            comments: (this.props.files[index] && this.props.files[index].comments) || [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.props.dispatchFetchFile(this.props.match.params.id, () => {
            this.setState({ isLoading: false })
        })
    }

    renderBlocks() {
        return this.props.files[this.state.index].blocks.map((value, index) => {
            return (
                <RichTextEditor
                    key={`blocks-${index}`}
                    value={RichTextEditor.createValueFromString(value, 'markdown')}
                    readOnly={true}
                />
            )
        })
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div className="c-file-container">
                <div className="c-file-content">
                    <h3>Build Your Resume Here</h3>
                </div>
                <div className="c-file-blocks">
                    <h3>Your Personal Blocks</h3>
                    <CommentBox docId={this.props.match.params.id} />
                </div>
            </div>
        )
    }
}

ShareFile.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    dispatchFetchFile: PropTypes.func.isRequired,
    files: PropTypes.arrayOf(PropTypes.shape({
        doc_id: PropTypes.string.isRequired,
        comments: PropTypes.array,
        blocks: PropTypes.array,
    })).isRequired,
}

const mapStateToProps = ({ app }) => ({
    files: app.files,
})


export default connect(mapStateToProps, actions)(ShareFile)
