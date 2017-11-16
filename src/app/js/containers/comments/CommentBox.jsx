import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Comment from './Comments'
const axios = require('axios')
const io =require('socket.io-client')

class CommentBox extends Component {
    // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments
    // get comments from server? for now we fake it
    constructor(props) {
        super(props)
        this.state = {
            fakeComments:[],
            newInput: '',
            docId: this.props.currentDoc,
            commentCount: 0,
            currentUser: this.props.user.info.username,
        }
        // Enter the commment socket namespace
        this.socket = io('/comments')
    }

    componentDidMount() {
        this.socket.emit('joinRoom',this.state.docId)
        this.fetchComments()
        //listen to events emitted from server
        this.socket.on('update', (newComment) =>
        {
            this.recieveComment(newComment)
        }
        )
    }

    render() {
        const commentsToShow = this.state.fakeComments.length > 0 ? this.displayComments()  : []
        return (
            <div className="c-comment_container">
                <h1> Comments ( {this.state.commentCount} ) </h1>
                { commentsToShow}
                <textarea className="c-comment_input" placeholder="Enter comment and press Enter"    onKeyPress ={(e) =>this.createComment(e)} onInput= {(e) => this.getInput(e)}  type="text"></textarea>
            </div>
        )
    }

    //Makes API call to get comments from database,
    // current code only mocks an empty array of comments
    fetchComments() {
        let that = this
        axios.get('/comment',{params:{docId:this.state.docId}})
            .then(function(response) {
                that.setState({fakeComments:response.data.comments})
                that.updateCommentCount()
                return
            })
            .catch(function(exception){
                console.log(exception)
                that.setState({fakeComments:[]})
                that.updateCommentCount()
                return
            })
    }

    updateCommentCount(){
        this.setState({commentCount:this.state.fakeComments.length})
    }

    displayComments(){
        return this.state.fakeComments.map(function (entry,index){
            return <Comment key = {index} comment = {entry}/>
        })
    }

    getInput($event){
        this.setState({newInput :$event.target.value})
    }

    getCurrentTime(){
        let currentTime = new Date().getTime()
        return currentTime
    }

    createComment(event) {
        let that = this
        if(event.key == 'Enter') {
            let newComment = {
                content: this.state.newInput,
                timeStamp:this.getCurrentTime(),
                user_id: this.state.currentUser,
                docId:this.state.docId,
            }
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

    recieveComment(msg){
        this.state.fakeComments.push(msg.comment)
        this.setState({fakeComments: this.state.fakeComments.slice()})
        this.updateCommentCount()
    }
}

CommentBox.propTypes = {
    currentDoc: PropTypes.string.isRequired,
    user: PropTypes.any.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
})


//export default CommentBox
export default connect(mapStateToProps)(CommentBox)
