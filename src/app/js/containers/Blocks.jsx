import React, { Component } from 'react'
import RichTextEditor from 'react-rte'
import autobind from 'class-autobind'
import { createValueFromString } from 'react-rte'
import { EditorValue } from 'react-rte'

class TextEditor extends Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            value: createValueFromString('', 'markdown'),
            format: 'markdown',
            readOnly: false,
            currentBlock: null,

        }
    }

    render() {
        let { value, format } = this.state

        return (
            <div>
                <div>
                    <RichTextEditor
                        value={value}
                        onChange={this._onChange}
                        placeholder="Tell a story"
                        readOnly={this.state.readOnly}
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Editor Source"
                        value={value.toString(format)}
                        onChange={this._onChangeSource}
                    />
                </div>
                <div>
                    <span>Save...working?:</span>
                    <button onClick={this._saveData}>Save</button>
                </div>
            </div>
        )
    }

    _saveData() {
        let { value, format } = this.state
        console.log('data: ', value.toString(format))
        this.state.currentBlock.data = value.toString(format)
        this._blocksComponent._currentBlock = this.state.currentBlock
        this._blocksComponent.updateData()
    }

    _onChange(value: EditorValue) {
        this.setState({ value })
    }

    _onChangeSource(event: Object) {
        let source = event.target.value
        let oldValue = this.state.value
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format),
        })
    }

    updateData(block, blocksComponent) {
        this._blocksComponent = blocksComponent
        blocksComponent._currentBlock = block
        this.state.currentBlock = block

        let oldValue = this.state.value

        this.setState({
            value: oldValue.setContentFromString(this.state.currentBlock.data, this.state.format),
        })
    }
}

class AppComponent extends React.Component {
    state = {
        numChildren: 0,
        blocks: []
    }

    render() {
        const children = [];

        for (var i = 0; i < this.state.numChildren; i += 1) {
            children.push(<BlockChildComponent key={i} number={i} onClick={this.testFunc} data={"test"} />);
        };

        return (
            <BlockParentComponent addChild={this.onAddChild.bind}>
                {children}
            </BlockParentComponent>
        );
    }

    onAddChild = () => {
        this.setState({
            numChildren: this.state.numChildren + 1
        });
    }

    testFunc(data) {
        alert(data)
    }
}

const BlockParentComponent = props => (
    <div className="card calculator">
        <p><button onClick={props.addChild}>Add Another Child Component</button></p>
        <div id="children-pane">
            {props.children}
        </div>
    </div>
);

const BlockChildComponent = props => <button onClick={props.onClick.bind(this, props.block)}>{"Edit: " + props.block.name}</button>;

class Blocks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numChildren: 0,
            blocks: []
        }
    }
    componentWillMount() {
        this.setState({
            numChildren: 0
        });
        this.getData()
    }

    getData() {
        const block1 = {
            name: 'name1',
            data: '~~data1~~ data1 data1 data1'
        }
        const block2 = {
            name: 'name2',
            data: 'data2 ``data2`` data2 data2'
        }
        //var blockArr = []
        this.AddChild(block1)

        this.AddChild(block2)
        //this.state.numChildren = 2


        //this.blocks = blockArr
    }

    updateData() {
        console.log('Implement updataData()')
    }

    handleClick(block) {
        console.log('data:', block)
        this._editor.updateData(block, this)
    }

    AddChild(newBlock) {
        console.log(newBlock.name)
        var blocks = this.state.blocks.slice()
        console.log("slice: " + blocks)
        blocks.push(newBlock)
        console.log("push: " + blocks)

        this.setState({ blocks: blocks })

        this.setState({
            numChildren: this.state.numChildren + 1
        });
        console.log("numChildren post: " + this.state.numChildren)

    }

    testFunc(block) {
        alert(block.name)
    }

    render() {
        const children = [];
        const blockD = {
            name: 'name' + this.state.numChildren + 1,
            data: 'data' + (this.state.numChildren + 1) + ' ``data' + (this.state.numChildren + 1) + ' ~data' + (this.state.numChildren + 1) + '~',
        }
        for (var i = 0; i < this.state.numChildren; i++) {
            children.push(<BlockChildComponent key={i} number={i} onClick={this.testFunc} block={this.state.blocks[i]} />);
        };
        return (
            <div>
                <p>{this.state.numChildren}</p>
                <BlockParentComponent addChild={this.AddChild.bind(this, blockD)}>
                    {children}
                </BlockParentComponent>
                <div>Blocks View</div>
                <TextEditor ref={(editor) => { this._editor = editor }} />
            </div>

        )
    }
}


export default Blocks
