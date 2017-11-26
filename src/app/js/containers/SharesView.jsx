import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import ShareBlock from '../components/ShareBlock'

class Shares extends Component {
    componentDidMount() {
        // TODO: replace with fetch shared files
        this.props.dispatchFetchFiles()
    }

    renderFiles() {
        return this.props.files.map(({ title, doc_id }) => {
            return (
                <ShareBlock
                    key={`file-block-${title}`}
                    id={doc_id}
                    name={title}
                />
            )
        })
    }

    render() {
        return (
            <div>
                Shares View
                {/* TODO: replace with shared files */}
                {this.renderFiles()}
            </div>
        )
    }
}

Shares.propTypes = {
    files: PropTypes.array.isRequired,
    dispatchFetchFiles: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app }) => ({
    // TODO: replace with shared files
    files: app.files,
})

export default connect(mapStateToProps, actions)(Shares)
