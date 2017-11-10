import React, { Component } from "react"
import Comment from "./comments"



class CommentBox extends Component {
 // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments


 // get comments from server? for now we fake it 


 constructor(props) {
    super(props);
    this.state = {fakeComments: [],
                  newInput:"",
                  roomName:"myBox",
                  commentCount: 0};

    // remove this once we have a proper implementation to fetch comemnts from server
    // Enter the commment socket namespace
     this.socket = io('/comments');

}
    componentDidMount(){

        this.socket.emit("joinRoom",this.state.roomName);

        //listen to events emitted from server
        this.socket.on("update", (newComment) => {
            {
                this.recieveComment(newComment);
            }
        });

    }

    render() {

        this.displayComments = this.fetchComments();
        return (
            <div className="comment_container">
            
               <h1> Comments ( {this.state.commentCount} ) </h1>
              
                 {this.displayComments}
               
               <textarea id="comment_input" placeholder="Enter comment and press Enter" onKeyPress ={(e) =>this.createComment(e)} onInput= {(e) => this.getInput(e)} class="reply" type="text"></textarea>
              
               
            </div>
        );
    }

    //Makes API call to get comments from database, 
    // current code only mocks an empty array of comments
    fetchComments() {
        var displayComments = this.state.fakeComments.map(function (entry){
            return <Comment comment = {entry}/>
             }
        );  
        return displayComments;
    }

    getInput($event){
        this.setState({newInput :$event.target.value});

    }
    changeRoom(){
        this.setState({roomName:"newRoom"});
    }

    recieveComment(msg){
        this.state.fakeComments.push(msg.comment);
        this.setState({fakeComments: this.state.fakeComments.slice()});
        this.updateCommentCount();
    }


    updateCommentCount(){
        this.setState({commentCount:this.state.fakeComments.length});
    }


    getCurrentTime(){
        let time = new Date();
        let hours = time.getHours();
        let mins = time.getMinutes();
        let period = hours > 12 ? "pm" :"am";
        if (hours > 12) {
            hours - 12
        }
        return hours+":" + mins + " " + period;
    }
    createComment(event){
        if(event.key == "Enter") {
            var newComment = {data: this.state.newInput , date:this.getCurrentTime() , author:"me"};
            this.state.fakeComments.push(newComment);
            var newComments = this.state.fakeComments.slice();
            this.setState({fakeComments : newComments});
            this.updateCommentCount();
            this.socket.emit('comment', {comment:newComment,roomId: this.state.roomName });
        }

    }
}
export default CommentBox
