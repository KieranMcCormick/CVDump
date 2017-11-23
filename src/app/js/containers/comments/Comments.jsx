import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Comment extends Component {
    // UI representation of a Comment box, takes in a comment object and displays the date,data, and author and length of reply thread
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="c-comment">
                <div className ="c-comment__header">
                    <p className="c-comment__author"> {this.props.comment.username} </p>
                    <p className="c-comment__date"> {this.props.comment.createdAt} </p>
                </div>
                <p className="c-comment__data">{this.props.comment.content} </p>
            </div>
        )
    }
}

Comment.propTypes = {
    comment: PropTypes.shape({
        content: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
}

export default Comment
