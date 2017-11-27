import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../actions'
import Comment from './Comments'
import SocketHandler from '../../global/socketsHandler'
import moment from 'moment'


class CommentBox extends Component {
    // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments
    // get comments from server? for now we fake it
    constructor(props) {
        super(props)

        this.createComment = this.createComment.bind(this)
        this.onClickHandler = this.onClickHandler.bind(this)
    }

    componentDidMount() {
        SocketHandler.joinRoom('comments', this.props.docId)
        SocketHandler.listen(
            'comments',
            'update',
            (newComment) => this.props.dispatchReceiveComment(newComment)
        )
    }

    componentWillUnmount() {
        SocketHandler.leaveRoom('comments', this.props.docId)
    }

    // componentWillReceiveProps({ files }) {
    //     const { comments, index } = this.state
    //     if (files[index].comments && comments.length < files[index].comments.length) {
    //         this.setState({
    //             comments: files[index].comments,
    //         })
    //     }
    // }

    onClickHandler(comment) {
        this.createComment(comment)
        this.textArea.value = ''
    }

    render() {
        return (
            <div className="c-comment__container">
                <h5> Comments ({this.props.selectedFile.comments.length}) </h5>
                <div className="c-comment__comment-list">
                    {this.displayComments()}
                </div>
                <div className="c-comment__input">
                    <textarea
                        type="text"
                        placeholder="Enter comment"
                        ref={(input) => this.textArea = input}
                    />
                    <button onClick={this.onClickHandler}>Send</button>
                </div>
            </div>
        )
    }

    displayComments() {
        return this.props.selectedFile.comments.map((comment, index) => {
            return <Comment key={`file-comment-${index}`} comment={comment} />
        })
    }

    createComment() {
        this.props.dispatchCreateComment({
            content: this.textArea.value,
            createdAt: new moment().format('YYYY-MM-DD hh:mm:ss'),
            username: this.props.user.info.username,
            docId: this.props.docId,
        })
    }
}

CommentBox.propTypes = {
    docId: PropTypes.string.isRequired,
    user: PropTypes.shape({
        info: PropTypes.shape({
            username: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    selectedFile: PropTypes.shape({
        comments: PropTypes.array.isRequired,
    }),
    dispatchCreateComment: PropTypes.func.isRequired,
    dispatchReceiveComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    selectedFile: state.app.selectedFile,
    user: state.user,
})


export default connect(mapStateToProps, actions)(CommentBox)
