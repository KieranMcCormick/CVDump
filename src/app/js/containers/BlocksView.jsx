import React, { Component } from 'react'
import RichTextEditor, { createEmptyValue, EditorValue } from 'react-rte'
import PropTypes from 'prop-types'

class TextEditor extends Component {
    constructor(props) {
        super(props)
        this.saveData = this.saveData.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeSource = this.onChangeSource.bind(this)
        this.updateData = this.updateData.bind(this)
        this.state = {
            value: createEmptyValue(),
            format: 'markdown',
            readOnly: false,
        }
    }

    render() {
        let { value, format } = this.state

        return (
            <div>
                <div>
                    <RichTextEditor
                        value={value}
                        onChange={this.onChange}
                        placeholder="Tell a story"
                        readOnly={this.state.readOnly}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Editor Source"
                        value={value.toString(format)}
                        onChange={this.onChangeSource}
                    />
                </div>
                <div>
                    <span>Save:</span>
                    <button onClick={this.saveData}>Save</button>
                </div>
            </div>
        )
    }

    onChange(value) {
        this.setState({ value })
    }

    onChangeSource(event) {
        const source = event.target.value
        const oldValue = this.state.value
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format),
        })
    }

    updateData(block) {
        let { value, format } = this.state
        this.currentBlock = block
        this.setState({
            value: value.setContentFromString(this.currentBlock.data, format),
        })
    }

    saveData() {
        let { value, format } = this.state
        this.currentBlock.data = value.toString(format)
    }
}

const BlockParentComponent = props => (
    <div>
        <button onClick={props.addChild}>+</button>
        {props.children}
    </div>
)

BlockParentComponent.propTypes = {
    addChild: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
}

const BlockChildComponent = props =>
    <button onClick={props.onClick.bind(this, props.block)}>
        {'Edit: ' + props.block.name}
    </button>

BlockChildComponent.propTypes = {
    onClick: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
}

class Blocks extends Component {
    constructor(props) {
        super(props)
        this.getData = this.getData.bind(this)
        this.updateData = this.updateData.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.addChild = this.addChild.bind(this)

        this.state = {
            blocks: [],
        }
    }
    componentDidMount() {
        this.getData()
    }

    getData() {
        const block1 = {
            name: 'name1',
            data: '~~data1~~ data1 data1 data1',
        }
        const block2 = {
            name: 'name2',
            data: 'data2 ``data2`` data2 data2',
        }
        this.addChild(block1)
        this.addChild(block2)
    }

    updateData() {
        console.log('Implement updataData()')
    }

    handleClick(block) {
        this.editorRef.updateData(block)
    }

    addChild(newBlock) {
        let blocks = this.state.blocks
        blocks.push(newBlock)
        this.setState({ blocks: blocks })
    }

    render() {
        const tmpBlock = {
            name: 'new block',
            data: '',
        }

        const children = this.state.blocks.map((block, index) =>
            <BlockChildComponent
                key={index}
                onClick={this.handleClick}
                block={block}
            />
        )

        return (
            <div>
                <div>Blocks View</div>
                <BlockParentComponent addChild={this.addChild.bind(this, tmpBlock)}>
                    {children}
                </BlockParentComponent>
                <TextEditor ref={(editor) => { this.editorRef = editor }} />
            </div>
        )
    }
}

export default Blocks