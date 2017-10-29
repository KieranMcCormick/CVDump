import React, { Component, } from "react"

class App extends Component {
   comment_object = {data: "test data" , date:"test date" , author:"me"};
    render() {
        return (
            <div className="app">
                <header className="app-header">
                    <h1> Welcome to our resume builder </h1>
                    <Comment comment ={comment_object}></Comment>
                </header>
            </div>
        )
    }
}
export default App
