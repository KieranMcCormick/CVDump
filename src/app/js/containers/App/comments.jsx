<<<<<<< HEAD
import React, { Component } from 'react'

class Comment extends Component {
    // UI representation of a Comment , takes in a comment object and displays the date,data, and author and length of reply thread
    constructor(props) {
        super(props)
        this.state = {currentDate: new Date()}
    }
    render() {
        return (
            <div className="comment">
                <h1> Comment </h1>
                <p className="comment_date"> {this.props.comment.date} </p>
                <p className="comment_author"> By: {this.props.comment.author} </p>
                <p className="comment_data">{this.props.comment.data} </p>
            </div>
        )
=======
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
               <p class="comment_date"> {this.props.comment.date} </p>
               <p class="comment_author"> By: {this.props.comment.author} </p>
               <p class="comment_data">{this.props.comment.data} </p>
            </div>
        );
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d
    }
}
export default Comment
