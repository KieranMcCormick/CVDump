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
               <h1> Comment </h1>
               <p class="comment_date"> {this.props.comment} </p>
               <p class="comment_author"> By: {this.props.comment.author} </p>
               <p class="comment_data">{this.props.comment.data} </p>
               <p> Replies ({this.props.comment.thread.length})</p>

            </div>
        )
    }
}
export default Comment
