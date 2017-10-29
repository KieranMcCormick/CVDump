import React, { Component, } from "react"
import CommentBox from "./comment_box"

class App extends Component {
    
    render() {
       
        return (
            <div className="app">
                <header className="app-header">
                    <h1> Welcome to our resume builder </h1>
                   
                </header>
                <CommentBox></CommentBox>
            </div>
        )
    }
}
export default App
