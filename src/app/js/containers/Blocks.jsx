import React, {Component} from 'react';
import RichTextEditor, {createEmptyValue} from 'react-rte';
import {convertToRaw} from 'draft-js';
import autobind from 'class-autobind';
import {createValueFromString} from 'react-rte';

import {EditorValue} from 'react-rte';

class TextEditor extends Component {
   
    constructor() {
        super(...arguments);
        autobind(this);
        this.state = {
            value: createValueFromString("", 'markdown'),
            format: 'markdown',
            readOnly: false,
        };
    }

    render() {
    let {value, format} = this.state;

    return (
        <div className="row">

        <div className="row">
            <RichTextEditor
                value={value}
                onChange={this._onChange}
                className="react-rte"
                placeholder="Tell a story"
                toolbarClassName="toolbar"
                editorClassName="editor"
                readOnly={this.state.readOnly}
            />
        </div>
        
        <div className="row">
            <textarea
                className="source"
                placeholder="Editor Source"
                value={value.toString(format)}
                onChange={this._onChangeSource}
            />
        </div>
        <div className="row">
            <span className="label">Save...not working:</span>
            <button className="btn" onClick={this._saveData}>XSaveX</button>
        </div>
        </div>
    );
    }
    _saveData(){
        let {value, format} = this.state;
        
        console.log("data: ", value.toString(format))
        console.log("nothing yet")
    }

    _onChange(value: EditorValue) {
        this.setState({value});
    }

    _onChangeSource(event: Object) {
        let source = event.target.value;
        let oldValue = this.state.value;
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format),
        });
    }

    updateData(data){
        console.log("trying to update to this: ", data)
        let {value, format} = this.state;
        console.log("current: ", value.toString(format))

        let oldValue = this.state.value;
        this.setState({
            value: oldValue.setContentFromString(data, this.state.format),            
        })    
    }
}

class Blocks extends Component {

    getData() {
        var block1 = { name: "name1", data: "~~data1~~ data1 data1 data1" }
        var block2 = { name: "name2", data: "data2 data2 data2 data2" }
        var blockArr = []
        blockArr.push(block1)
        blockArr.push(block2)
        return blockArr;
    }

    handleClick(data) {
        console.log('data:', data);
        this._editor.updateData(data);
        console.log('this is:', this);
      }

    renderBlocks(blockArr) {
        const self = this
        return blockArr.map((item, index) =>
            <button onClick={this.handleClick.bind(this, item.data)}>{item.name}'s button</button>
        )
    }
    testFunc = () => {
        alert("test");

    }
    render() {

        return (
            <div>
                <div>Blocks View</div>
                <button onClick={this.testFunc}>+</button>
                {this.renderBlocks(this.getData())}
                <TextEditor ref={(editor) => { this._editor = editor; }} />
            </div>
        )
    }
}


export default Blocks
