import React, { Component } from "react"
import Comment from "./comments"



class CommentBox extends Component {
 // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments


 // get comments from server? for now we fake it 


 constructor(props) {
    super(props);
    this.state = {fakeComments: [],
                  newInput:""  };
    
    // remove this once we have a proper implementation to fetch comemnts from server

    
}
    render() {
        console.log("rending");
        this.displayComments =this.state.fakeComments.map(function (entry){
                console.log(entry);
                return <Comment comment = {entry}/>
                 }
        );  
        return (
            <div className="comment_container">
               <h1> Comments </h1>
               <ul>
                 {this.displayComments}
               </ul>
               <input  onInput= {(e) => this.getInput(e)} class="reply" type="text"></input>
               <button onClick ={() =>this.createComment()}> Submit </button>
            </div>
        );
    }

    getInput($event){
        console.log($event.target.value);
        this.setState({newInput :$event.target.value});

    }

    createComment(){
        console.log("fired event");
        console.log(this.state.fakeComments);
        var newComment = {data: this.state.newInput , date:"just now" , author:"me" ,thread: ['9']};
        this.state.fakeComments.push(newComment);
        var newComments = this.state.fakeComments.slice();
        this.setState({fakeComments : newComments});
        

    }
}
export default CommentBox
