import React, { Component } from 'react'
import CommentBox from './App/comment_box'

class Files extends Component {
    render() {
        return (
            <div className="mock_doc_view">
                <h1>Files View</h1>

                <div className ="comments_tab" >
                    <CommentBox></CommentBox>
                </div>
            </div>
        )
    }
}


export default Files
