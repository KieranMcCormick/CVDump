import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import _ from 'lodash'
import Loader from './Loader'
import { FlatButton, TextField, Snackbar } from 'material-ui'
import EditableBlock from './EditableBlock'
import classNames from 'classnames'
import moment from 'moment'


class File extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isEditing: false,
        }
    }

    componentDidMount() {
        const { selectedFile, location: { pathname } } = this.props
        const lastIndex = pathname.lastIndexOf('/')
        const isNew = selectedFile.isNew || pathname.substring(lastIndex + 1) === 'new'
        const callback = () => {
            this.setState({
                isLoading: false,
                isNew: isNew,
                hasMessage: false,
                message: '',
            })
        }
        const id = isNew ? '' : this.getDocumentId()
        this.props.dispatchFetchFile(id, callback)
    }

    componentWillUnmount() {
        // clears the selected file
        this.props.dispatchSelectFile()
    }

    getDocumentId() {
        // if user refresh on the file, then selectedFile would be empty
        const lastIndex = this.props.location.pathname.lastIndexOf('/')
        return this.props.selectedFile.id || this.props.location.pathname.substring(lastIndex + 1)
    }

    onSave() {
        this.setState({
            isLoading: true,
            hasMessage: false,
            message: '',
        })
        const title = this.titleNode.getValue()
        const blocks = this.props.selectedFile.blocks
        const callback = (message) => {
            this.setState({
                isLoading: false,
                hasMessage: true,
                message,
            })
        }
        if (this.state.isNew) {
            const data = {
                title,
                blocks,
                created_at: new moment().format('YYYY-MM-DD hh:mm:ss'),
            }
            this.props.dispatchCreateFile(data, callback)
        } else {
            this.props.dispatchUpdateFile(this.getDocumentId(), title, blocks, callback)
        }
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
            <EditableBlock key={`available-blocks-${index}`} value={value.summary} />
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

    renderMessage() {
        return (
            <Snackbar
                open={this.state.hasMessage}
                message={this.state.message}
                autoHideDuration={2000}
            />
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
                    {this.renderMessage()}
                    {this.renderButtons()}
                    <TextField
                        defaultValue={this.props.selectedFile.title}
                        floatingLabelText="Title"
                        ref={ref => this.titleNode = ref}
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
    //dispatchSavePdf: PropTypes.func.isRequired,
    dispatchCreateFile: PropTypes.func.isRequired,
    dispatchUpdateFile: PropTypes.func.isRequired,
    dispatchFetchFile: PropTypes.func.isRequired,
    dispatchSelectFile: PropTypes.func.isRequired,
    selectedFile: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        blocks: PropTypes.arrayOf(PropTypes.shape({
            blockOrder: PropTypes.number.isRequired,
            summary: PropTypes.string.isRequired,
        })).isRequired,
        availableBlocks: PropTypes.arrayOf(PropTypes.shape({
            blockId: PropTypes.string.isRequired,
            summary: PropTypes.string.isRequired,
        })),
        isNew: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = ({ app }) => ({
    selectedFile: app.selectedFile,
})


export default withRouter(connect(mapStateToProps, actions)(File))
