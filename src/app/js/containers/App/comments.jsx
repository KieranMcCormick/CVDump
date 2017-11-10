import React, { Component } from "react"

class Comment extends Component {
 // UI representation of a Comment box, takes in a comment object and displays the date,data, and author and length of reply thread
 constructor(props) {
    super(props);
    this.state = {currentDate: new Date()};
  }
    render() {
        return (
            <div className="comment">
                <div className ="comment_header">
                  <p className="comment_author"> By: {this.props.comment.author} </p>
                  <p className="comment_date"> {this.props.comment.date} </p>
                </div>
                  <p className="comment_data">{this.props.comment.data} </p>
            </div>
        );
    }
}
export default Comment
