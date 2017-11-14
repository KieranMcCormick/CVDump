import React, { Component } from 'react'
import PropTypes from 'prop-types'
const timestamp = require('time-stamp');

class Comment extends Component {
    // UI representation of a Comment box, takes in a comment object and displays the date,data, and author and length of reply thread
    constructor(props) {
        super(props)
        this.state = {currentDate: new Date()}
    }

    render() {
        console.log("these created ?")
        return (
            <div className="c-comment">
                <div className ="c-comment__header">
                    <p className="c-comment__author"> {this.props.comment.user_id} </p>
                    <p className="c-comment__date"> {new Date(this.props.comment.timeStamp).toISOString().substring(0,10)} </p>
                </div>
                <p className="c-comment__data">{this.props.comment.content} </p>
            </div>
        )
    }
}



Comment.propTypes = {
    comment: PropTypes.any.isRequired,
}

export default Comment
