import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Comment from './Comments'


const axios = require('axios')
const io = require('socket.io-client')

class CommentBox extends Component {
    // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments
    // get comments from server? for now we fake it
    constructor(props) {
        super(props)

        this.state = {
            fakeComments: [],
            newInput: '',
            docId: this.props.currentDoc,
            commentCount: 0,
            currentUser: this.props.user.info.username,
        }
        // Enter the comment socket namespace
        this.socket = io('/comments')
    }

    componentDidMount() {
        this.socket.emit('joinRoom', this.state.docId)
        this.fetchComments()
        //listen to events emitted from server
        this.socket.on(
            'update',
            (newComment) => this.receiveComment(newComment)
        )
    }

    render() {
        const commentsToShow = this.state.fakeComments.length > 0
            ? this.displayComments()
            : []
        return (
            <div className="c-comment__container">
                <h1> Comments ( {this.state.commentCount} ) </h1>
                {commentsToShow}
                <textarea
                    type="text"
                    className="c-comment__input"
                    placeholder="Enter comment and press Enter"
                    onKeyPress={(e) => this.createComment(e)}
                    onInput={(e) => this.getInput(e)}
                />
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
            })
            .catch(function(error){
                console.error(error)
                that.setState({ fakeComments: [] })
                that.updateCommentCount()
            })
    }

    updateCommentCount(){
        this.setState({ commentCount: this.state.fakeComments.length })
    }

    displayComments(){
        return this.state.fakeComments.map((entry, index) => {
            return <Comment key={index} comment={entry} />
        })
    }

    getInput(event){
        this.setState({ newInput: event.target.value })
    }

    createComment(event) {
        const that = this
        if(event.key === 'Enter') {
            const newComment = {
                content: this.state.newInput,
                timeStamp: new Date().getTime(),
                user_id: this.state.currentUser,
                docId: this.state.docId,
            }
            axios.post('/comment/create', newComment, { xsrfCookieName: '_csrfToken' })
                .then( function(response) {
                    console.log(response)
                    that.state.fakeComments.push(newComment)
                    const newComments = that.state.fakeComments.slice()
                    that.setState({ fakeComments : newComments })
                    that.updateCommentCount()
                    that.socket.emit(
                        'comment',
                        {
                            comment: newComment,
                            roomId: that.state.docId,
                        }
                    )
                })
                .catch( function(error) {
                    console.error(error)
                })
        }
    }

    receiveComment(msg){
        this.state.fakeComments.push(msg.comment)
        this.setState({ fakeComments: this.state.fakeComments.slice() })
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


export default connect(mapStateToProps)(CommentBox)
