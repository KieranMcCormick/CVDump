import React, { Component } from 'react'
import CommentBox from './comments/CommentBox'
import { connect } from 'react-redux'
class Files extends Component {
    render() {
        //hacky way of getting currently logged in user
        return (
            <div>
                Files View
                <CommentBox currentDoc ={1}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

export default connect(mapStateToProps)(Files)

