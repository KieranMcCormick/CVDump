import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'


class FileBlock extends PureComponent {
    onClickHandler() {
        this.props.dispatchSelectFile(this.props.id)
    }

    render() {
        return (
            <Link
                to={`/files/${this.props.id}`}
                className="c-file-block"
                onClick={this.onClickHandler.bind(this)}
            >
                <div>
                    <div className="u-padding-v-md">{this.props.name}</div>
                    <i className="material-icons md-lg">insert_drive_file</i>
                </div>
            </Link>
        )
    }
}

FileBlock.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    isAdd: PropTypes.bool,
}

FileBlock.defaultProps = {
    name: 'File',
    isAdd: false,
}

export default FileBlock
