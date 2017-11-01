import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Comment extends Component {
    // UI representation of a Comment box, takes in a comment object and displays the date,data, and author and length of reply thread
    constructor(props) {
        super(props)

        this.state = { currentDate: new Date() }
    }

    render() {
        return (
            <div className="c-comment">
                <div className="c-comment__header">
                    <p className="c-comment__author"> By: {this.props.comment.author} </p>
                    <p className="c-comment__date"> {this.props.comment.date} </p>
                </div>
                <p className="c-comment__data"> {this.props.comment.data} </p>
            </div>
        )
    }
}

Comment.propTypes = {
    // TODO: use .shape
    comment: PropTypes.any.isRequired,
}

export default Comment
