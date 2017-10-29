import React, { Component } from "react"
import Comment from "./comments"



class CommentBox extends Component {
 // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments


 // get comments from server? for now we fake it 


 constructor(props) {
    super(props);
    this.state = {fakeComments: []};
    
    // remove this once we have a proper implementation to fetch comemnts from server
    /*for (var i = 0 ; i <= 4 ; i ++) {
        var comment =  {data: "test data" , date:"test date" , author:"me" ,thread: ['9']};
        this.state.fakeComments.push(comment);
    }*/

    this.displayComments =this.state.fakeComments.map(function (entry){
        console.log(entry);
        return <Comment comment = {entry}/>
        }
    );
}
    render() {
        return (
            <div className="comment_container">
               <h1> Comments </h1>
               <ul>
                 {this.displayComments}
               </ul>
               <input class="reply" type="text"></input>
               <button onClick ={() =>this.createComment()}> Submit </button>
            </div>
        );
    }

    createComment(){
        console.log("fired event");
        console.log(this.state.fakeComments);
        var newComment = {data: "test data" , date:"just now" , author:"me" ,thread: ['9']};
        this.state.fakeComments.push(newComment);
        var newComments = this.state.fakeComments.slice();
        this.setState({fakeComments : newComments});
        

    }
}
export default CommentBox
