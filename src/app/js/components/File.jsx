import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import _ from 'lodash'
import Loader from './Loader'
import FlatButton from 'material-ui/FlatButton'
import EditableBlock from './EditableBlock'


class File extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isEditing: false,
        }
    }

    componentDidMount() {
        this.props.dispatchFetchFile(this.props.selectedFile.id, () => {
            this.setState({ isLoading: false })
        })
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
            <div>
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
        return (
            <div className="c-file-container">
                <div className="c-file-content">
                    <h3>Build Your Resume Here</h3>
                    {this.renderButtons()}
                    {this.renderFileBlock()}
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
    // dispatchSavePdf: PropTypes.func.isRequired,
    dispatchFetchFile: PropTypes.func.isRequired,
    selectedFile: PropTypes.shape({
        id: PropTypes.string.isRequired,
        blocks: PropTypes.arrayOf(PropTypes.shape({
            blockOrder: PropTypes.number.isRequired,
            summary: PropTypes.string.isRequired,
        })).isRequired,
        availableBlocks: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
}

const mapStateToProps = ({ app }) => ({
    selectedFile: app.selectedFile,
})


export default connect(mapStateToProps, actions)(File)
