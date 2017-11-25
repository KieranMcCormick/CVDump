import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'


class ShareBlock extends PureComponent {
    render() {
        return (
            <Link
                to={`/shares/${this.props.id}`}
                className="c-file-block"
                params={{ id: this.props.id }}
            >
                <div>
                    <div className="u-padding-v-md">{this.props.name}</div>
                    <i className="material-icons md-lg">insert_drive_file</i>
                </div>
            </Link>
        )
    }
}

ShareBlock.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    isAdd: PropTypes.bool,
}

ShareBlock.defaultProps = {
    name: 'File',
    isAdd: false,
}

export default ShareBlock
