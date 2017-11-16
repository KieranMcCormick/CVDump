import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Comment extends Component {
    // UI representation of a Comment box, takes in a comment object and displays the date,data, and author and length of reply thread
    constructor(props) {
        super(props)
        this.state = {currentIndex: this.props.key }
    }

    render() {
        return (
            <div className="c-comment">
                <div className ="c-comment__header">
                    <p className="c-comment__author"> {this.props.comment.user_id} </p>
                    <p className="c-comment__date"> {new Date(this.props.comment.timeStamp.toISOString().substring(0,10))} </p>
                </div>
                <p className="c-comment__data">{this.props.comment.content} </p>
            </div>
        )
    }
}

Comment.propTypes = {
    // TODO: use .shape
    comment: PropTypes.any.isRequired,
    key: PropTypes.string.isRequired,
}

export default Comment
