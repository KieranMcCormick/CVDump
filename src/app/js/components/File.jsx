import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import CommentBox from '../containers/comments/CommentBox'
import Loader from './Loader'
import { FlatButton, TextField } from 'material-ui'
import EditableBlock from './EditableBlock'
import classNames from 'classnames'


class File extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        const id = this.getDocumentId()
        this.props.dispatchFetchFile(id, () => {
            this.setState({ isLoading: false })
        })
    }

    getDocumentId() {
        // if user refresh on the file, then selectedFile would be empty
        const lastIndex = this.props.location.pathname.lastIndexOf('/')
        return this.props.selectedFile.id || this.props.location.pathname.substring(lastIndex + 1)
    }

    onSave() {
        // Uncomment when the endpoint is ready
        // this.dispatchSavePdf()
        // this.setState({ isLoading: true })
    }

    onShare() {

    }

    renderFileBlock() {
        const sorted = _.sortBy(this.props.selectedFile.blocks, 'blockOrder')
        return sorted.map((block, index) => (
            <EditableBlock
                key={`available-blocks-${index}`}
                value={block.summary}
                blockOrder={block.blockOrder}
                isEditing={this.state.isEditing}
            />
        ))
    }

    renderAvailableBlocks() {
        return this.props.selectedFile.availableBlocks.map((value, index) => (
            <EditableBlock key={`available-blocks-${index}`} value={value} />
        ))
    }

    renderEditButton() {
        if (this.state.isEditing) {
            return (
                <FlatButton
                    label="Done"
                    icon={<i className="material-icons">done</i>}
                    onClick={() => this.setState({ isEditing: !this.state.isEditing })}
                />
            )
        } else {
            return (
                <FlatButton
                    label="Edit File"
                    icon={<i className="material-icons">mode_edit</i>}
                    onClick={()=>(this.setState({ isEditing: !this.state.isEditing }))}
                />
            )
        }
    }

    renderButtons() {
        return (
            <div className="c-file-content__button">
                {this.renderEditButton()}
                <FlatButton
                    label="Save to PDF"
                    icon={<i className="material-icons">save</i>}
                    onClick={() => this.onSave()}
                />
                <FlatButton
                    label="Export to version"
                    icon={<i className="material-icons">save</i>}
                    onClick={() => this.onSave()}
                />
                <FlatButton
                    label="Share file"
                    icon={<i className="material-icons">share</i>}
                    onClick={() => this.onShare()}
                />
            </div>
        )
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        const fileClassName = classNames('c-file-content__file', {
            'c--active': !this.state.isEditing,
        })
        return (
            <div className="c-file-container">
                <div className="c-file-content">
                    {this.renderButtons()}
                    <TextField
                        defaultValue={this.props.selectedFile.title}
                        floatingLabelText="Title"
                    />
                    <div className={fileClassName}>
                        {this.renderFileBlock()}
                    </div>
                </div>
                <div className="c-file-blocks">
                    <h3>Your Personal Blocks</h3>
                    {this.renderAvailableBlocks()}
                </div>
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
    selectedFile: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        blocks: PropTypes.arrayOf(PropTypes.shape({
            blockOrder: PropTypes.number.isRequired,
            summary: PropTypes.string.isRequired,
        })).isRequired,
        availableBlocks: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = ({ app }) => ({
    files: app.files,
})


export default withRouter(connect(mapStateToProps, actions)(File))
