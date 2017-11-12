import React, { Component } from 'react'
import Comment from './Comments'
const axios = require('axios')
const io =require('socket.io-client')


class CommentBox extends Component {
    // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments
    // get comments from server? for now we fake it
    constructor(props) {
        super(props)
        this.state = {
            fakeComments: [],
            newInput: '',
            roomName: 'myBox',
            commentCount: 0
        }
        // Enter the commment socket namespace
        this.socket = io('/comments')
    }

    componentDidMount() {
        this.socket.emit('joinRoom',this.state.roomName)
        //listen to events emitted from server
        this.socket.on('update', (newComment) =>
        {
            this.recieveComment(newComment)
        }
        )
    }

    render() {
        this.displayComments = this.fetchComments()
        return (
            <div className="c-comment_container">
                <h1> Comments ( {this.state.commentCount} ) </h1>
                {this.displayComments}
                <textarea className="c-comment_input" placeholder="Enter comment and press Enter" onKeyPress ={(e) =>this.createComment(e)} onInput= {(e) => this.getInput(e)}  type="text"></textarea>
            </div>
        )
    }
    //Makes API call to get comments from database,
    // current code only mocks an empty array of comments
    fetchComments() {
        let displayComments = this.state.fakeComments.map(function (entry,index){
            return <Comment key = {index} comment = {entry}/>
        }
        )
        return displayComments
    }

    getInput($event){
        this.setState({newInput :$event.target.value})
    }

    changeRoom(){
        this.setState({roomName:'newRoom'})
    }

    recieveComment(msg){
        this.state.fakeComments.push(msg.comment)
        this.setState({fakeComments: this.state.fakeComments.slice()})
        this.updateCommentCount()
    }

    updateCommentCount(){
        this.setState({commentCount:this.state.fakeComments.length})
    }

    getCurrentTime(){
        let time = new Date()
        let hours = time.getHours()
        let mins = time.getMinutes()
        let period = hours > 12 ? 'pm' :'am'
        if (hours > 12) {
            hours = hours - 12
        }
        return hours+':' + mins + ' ' + period
    }

    createComment(event) {
        let that = this
        if(event.key == 'Enter') {
            let newComment = {data: this.state.newInput , date:this.getCurrentTime() , author:'me'}
            axios.post('/comment/create',newComment)
                .then( function(response) {
                    console.log(response)
                    that.state.fakeComments.push(newComment)
                    let newComments = that.state.fakeComments.slice()
                    that.setState({fakeComments : newComments})
                    that.updateCommentCount()
                    that.socket.emit('comment', {comment:newComment,roomId: that.state.roomName })
                })
                .catch( function(error){
                    console.log(error)
                })
        }
    }
}

export default CommentBox
