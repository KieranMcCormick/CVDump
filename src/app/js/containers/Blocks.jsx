import React, { Component } from 'react';
import RichTextEditor, { createEmptyValue } from 'react-rte';
import { convertToRaw } from 'draft-js';
import autobind from 'class-autobind';
import { createValueFromString } from 'react-rte';

import { EditorValue } from 'react-rte';

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
        let { value, format } = this.state;

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
                    <span className="label">Save...working?:</span>
                    <button className="btn" onClick={this._saveData}>Save</button>
                </div>
            </div>
        );
    }
    _saveData() {
        let { value, format } = this.state;
        console.log("data: ", value.toString(format))
        this._currentBlock.data = value.toString(format)
        this._blocksComponent._currentBlock = this._currentBlock
        this._blocksComponent.updateData()
    }

    _onChange(value: EditorValue) {
        this.setState({ value });
    }

    _onChangeSource(event: Object) {
        let source = event.target.value;
        let oldValue = this.state.value;
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format),
        });
    }

    updateData(block, blocksComponent) {
        this._blocksComponent = blocksComponent
        blocksComponent._currentBlock = block
        this._currentBlock = block

        let { value, format } = this.state;
        let oldValue = this.state.value;

        this.setState({
            value: oldValue.setContentFromString(this._currentBlock.data, this.state.format),
        })
    }
}

class AppComponent extends React.Component {
    state = {
        numChildren: 0
    }

    render() {
        const children = [];
        var block1 = { name: "name1", data: "~~data1~~ data1 data1 data1" }
        for (var i = 0; i < this.state.numChildren; i += 1) {
            children.push(<BlockChildComponent key={i} number={i} block={block1} />);
        };

        return (
            <BlockParentComponent addChild={this.onAddChild} block={block1}>
                {children}
            </BlockParentComponent>
        );
    }

    onAddChild = (data) => {
        console.log("ETRSETESTSETSETSTEST", data)
        this.setState({
            numChildren: this.state.numChildren + 1
        });
    }
}

const BlockParentComponent = props => (
    <div className="card calculator">
        <p><button onClick={props.addChild.bind(this, props.block.name)}>Add Another Child Component</button></p>
        <div id="children-pane">
            {props.children}
        </div>
    </div>
);

const BlockChildComponent = props => <button >{"I am child " + props.number}</button>;

const BlockParentComponent = props => (
    <div className="card calculator">
        <p><button onClick={props.addChild.bind(this, props.block)}>Add Another Child Component</button></p>
        <div id="children-pane">
            {props.children}
        </div>
    </div>
);

const BlockChildComponent2 = props => <button>{props.block.name}'s button</button>;

class Blocks extends Component {
    state = {
        numChildren: 0
    }
    getData() {
        var block1 = { name: "name1", data: "~~data1~~ data1 data1 data1" }
        var block2 = { name: "name2", data: "data2 ``data2`` data2 data2" }
        var blockArr = []
        blockArr.push(block1)
        blockArr.push(block2)
        this._blocks = blockArr
        console.log("blockArr[0]", blockArr[0])
        console.log("this._blocks[0]", this._blocks[0])
    }

    updateData() {
        console.log("Implement updataData()")
    }

    handleClick(block) {
        console.log('data:', block);
        this._editor.updateData(block, this);
    }

    renderBlocks() {
        const self = this
        return this._blocks.map((block, index) =>
            <button onClick={this.handleClick.bind(this, block)}>{block.name}'s button</button>
        )
    }
    testFunc = () => {
        var block3 = { name: "name3", data: "~~data3~~ data3 data3 data3" }

        this._blocks.push(block3)
        const self = this
        //let title = prompt("Please enter title")
        //console.log("Test: ", title)

    }

    onAddChild = (block) => {

        this.setState({
            numChildren: this.state.numChildren + 1
        });
    }

    render() {
        this.getData()
        const children = [];
        var block1 = { name: "name1", data: "~~data1~~ data1 data1 data1" }
        this.state.numChildren++;
        for (var i = 0; i < this.state.numChildren; i += 1) {
            children.push(<BlockChildComponent2 key={i} number={i} block={block1} />);
        };
        return (
            <div>
                <div>Blocks View</div>
                <button onClick={this.testFunc}>+</button>
                {this.renderBlocks()}
                <TextEditor ref={(editor) => { this._editor = editor; }} />
                <AppComponent />

                <br />
                <br />
                <br />

                <BlockParentComponent2 addChild={this.onAddChild} block={block1}>
                    {children}
                </BlockParentComponent2>
            </div>
        )
    }
}


export default Blocks
