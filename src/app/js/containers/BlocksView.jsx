import React, { Component } from 'react'
import { connect } from 'react-redux'
import RichTextEditor, { createEmptyValue } from 'react-rte'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import RaisedButton from 'material-ui/RaisedButton'

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
                    <textarea className="fillerup"
                        placeholder="Editor Source"
                        value={value.toString(format)}
                        onChange={this.onChangeSource}
                    />
                </div>
                <div>
                    <RaisedButton onClick={this.saveData}>Save</RaisedButton>
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
            value: value.setContentFromString(this.currentBlock.summary, format),
        })
    }

    saveData() {
        let { value, format } = this.state
        this.currentBlock.summary = value.toString(format)
        this.props.saveBlock(this.currentBlock)
    }
}

TextEditor.propTypes = {
    saveBlock: PropTypes.func.isRequired,
}

const BlockParentComponent = props => (
    <div>
        <RaisedButton className="u-margin-v-md u-full-width" onClick={props.addChild}>+</RaisedButton>
        {props.children}
    </div>
)

BlockParentComponent.propTypes = {
    addChild: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
}

const BlockChildComponent = props => (
    <RaisedButton className="u-margin-md padme" onClick={props.onClick.bind(this, props.block)}>
        {'Edit: ' + props.block.label}
    </RaisedButton>
)


BlockChildComponent.propTypes = {
    onClick: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
}

class Blocks extends Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
        this.addChild = this.addChild.bind(this)
        this.onChangeSource = this.onChangeSource.bind(this)
        this.saveBlock = this.saveBlock.bind(this)
        this.state = {
            oldblocks: [],
            inputValue: '',
        }

    }

    saveBlock(block){
        this.props.dispatchEditBlock(block)
    }
    componentDidMount() {
        this.props.dispatchFetchBlocks()
        //this.setState({oldblocks: this.props.blocks})
    }

    renderFiles() {
        return this.props.blocks.map(({ uuid, summary }) => {
            return (
                <p key={uuid}>
                    {summary}
                </p>
            )
        })
    }

    handleClick(block) {
        this.editorRef.updateData(block)
    }

    addChild(newType) {
        let newName = this.state.inputValue
        this.props.dispatchCreateBlock({
            label: newName,
            type: newType,
        })

        //this.props.blocks.push(newBlock)
        //this.forceUpdate()
    }

    onChangeSource(event) {
        const source = event.target.value
        this.setState({
            inputValue: source,
        })
    }

    render() {
        const HeadersChildren = this.props.blocks.map(function (block, index) {
            if (block.type == 'headers') {
                return <BlockChildComponent
                    key={index}
                    onClick={this.handleClick}
                    block={block}
                />
            }
        }.bind(this))

        const SkillsChildren = this.props.blocks.map(function (block, index) {
            if (block.type == 'skills') {
                return <BlockChildComponent
                    key={index}
                    onClick={this.handleClick}
                    block={block}
                />
            }
        }.bind(this))



        return (
            <div>
                <br />
                <p className="padme" >Name of new block:
                    <input
                        value={this.state.inputValue}
                        onChange={this.onChangeSource}
                    />
                </p>

                <div className="my_trow">
                    <div className="my_celll">
                        <div>Headers</div>
                        <BlockParentComponent addChild={this.addChild.bind(this, 'headers')}>
                            {HeadersChildren}
                        </BlockParentComponent>
                        <hr/>
                        <div>Skills</div>
                        <BlockParentComponent addChild={this.addChild.bind(this, 'skills')}>
                            {SkillsChildren}
                        </BlockParentComponent>
                    </div>
                    <div className="my_cellr">
                        <TextEditor saveBlock={this.saveBlock.bind(this)} ref={(editor) => { this.editorRef = editor }} />
                    </div>
                </div>
            </div>
        )
    }
}

Blocks.propTypes = {
    blocks: PropTypes.array.isRequired,
    dispatchCreateBlock: PropTypes.func.isRequired,
    dispatchEditBlock: PropTypes.func.isRequired,
    dispatchFetchBlocks: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app }) => ({
    blocks: app.blocks,
})

export default connect(mapStateToProps, actions)(Blocks)
