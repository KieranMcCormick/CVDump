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

class Blocks extends Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            numChildren: 0,
        }
    }

    getData() {
        const block1 = {
            name: 'name1',
            data: '~~data1~~ data1 data1 data1',
            key: '1'
        }
        const block2 = {
            name: 'name2',
            data: 'data2 ``data2`` data2 data2',
            key: '2'
        }
        const blockArr = []
        blockArr.push(block1)
        blockArr.push(block2)
        this.blocks = blockArr
    }

    updateData() {
        console.log('Implement updataData()')
    }

    handleClick(block) {
        console.log('data:', block)
        this._editor.updateData(block, this)
    }

    renderBlocks() {
        return this.blocks.map((block) =>
            <button key={block.key} onClick={this.handleClick.bind(this, block)}>{block.name}{'s button'}</button>
        )
    }
    testFunc = () => {
        let block3 = { name: 'name3', data: '~~data3~~ data3 data3 data3' }
        this.blocks.push(block3)
    }

    render() {
        this.getData()

        return (
            <div>
                <div>Blocks View</div>
                <button onClick={this.testFunc}>+</button>
                {this.renderBlocks()}
                <TextEditor ref={(editor) => { this._editor = editor }} />
            </div>
        )
    }
}


export default Blocks
