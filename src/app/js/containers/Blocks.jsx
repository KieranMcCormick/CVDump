import React, { Component } from 'react'
import RichTextEditor from 'react-rte'
import autobind from 'class-autobind'
import { createValueFromString } from 'react-rte'

import { EditorValue } from 'react-rte'

class TextEditor extends Component {

    constructor() {
        super(...arguments)
        autobind(this)
        this.state = {
            value: createValueFromString('', 'markdown'),
            format: 'markdown',
            readOnly: false,
        }
    }

    render() {
        let { value, format } = this.state

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
        )
    }
    _saveData() {
        let { value, format } = this.state
        console.log('data: ', value.toString(format))
        this._currentBlock.data = value.toString(format)
        this._blocksComponent._currentBlock = this._currentBlock
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
        this._currentBlock = block

        let oldValue = this.state.value

        this.setState({
            value: oldValue.setContentFromString(this._currentBlock.data, this.state.format),
        })
    }
}

class Blocks extends Component {
    state = {
        numChildren: 0,
    }
    getData() {
        let block1 = { name: 'name1', data: '~~data1~~ data1 data1 data1', key: '1' }
        let block2 = { name: 'name2', data: 'data2 ``data2`` data2 data2', key: '2' }
        let blockArr = []
        blockArr.push(block1)
        blockArr.push(block2)
        this._blocks = blockArr
        console.log('blockArr[0]', blockArr[0])
        console.log('this._blocks[0]', this._blocks[0])
    }

    updateData() {
        console.log('Implement updataData()')
    }

    handleClick(block) {
        console.log('data:', block)
        this._editor.updateData(block, this)
    }

    renderBlocks() {
        return this._blocks.map((block) =>
            <button key={block.key} onClick={this.handleClick.bind(this, block)}>{block.name}'s button</button>
        )
    }
    testFunc = () => {
        let block3 = { name: 'name3', data: '~~data3~~ data3 data3 data3' }
        this._blocks.push(block3)
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
