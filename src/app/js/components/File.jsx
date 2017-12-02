import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import _ from 'lodash'
import Loader from './Loader'
import { FlatButton, TextField, Snackbar } from 'material-ui'
import EditableBlock from './EditableBlock'
import classNames from 'classnames'
import moment from 'moment'
import Dialog from 'material-ui/Dialog'
import Chip from 'material-ui/Chip';
import {validateEmail} from '../global/common'



class File extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isEditing: false,
            modal: false,
            tags: [],
        }
    }

    componentDidMount() {
        const { selectedFile, location: { pathname } } = this.props
        const lastIndex = pathname.lastIndexOf('/')
        const isNew = selectedFile.isNew || pathname.substring(lastIndex + 1) === 'new'
        const callback = () => {
            this.setState({
                isLoading: false,
                isNew: isNew,
                hasMessage: false,
                message: '',
            })
        }
        const id = isNew ? '' : this.getDocumentId()
        this.props.dispatchFetchFile(id, callback)
    }

    componentWillUnmount() {
        // clears the selected file
        this.props.dispatchSelectFile()
    }

    getDocumentId() {
        // if user refresh on the file, then selectedFile would be empty
        const lastIndex = this.props.location.pathname.lastIndexOf('/')
        return this.props.selectedFile.id || this.props.location.pathname.substring(lastIndex + 1)
    }

    onSave() {
        this.setState({
            isLoading: true,
            hasMessage: false,
            message: '',
        })
        const title = this.titleNode.getValue()
        const blocks = this.props.selectedFile.blocks
        const callback = (message) => {
            this.setState({
                isLoading: false,
                hasMessage: true,
                message,
            })
        }
        if (this.state.isNew) {
            const data = {
                title,
                blocks,
                created_at: new moment().format('YYYY-MM-DD hh:mm:ss'),
            }
            this.props.dispatchCreateFile(data, callback)
        } else {
            this.props.dispatchUpdateFile(this.getDocumentId(), title, blocks, callback)
        }
    }

    onShare() {
        this.props.dispatchShareFile(this.getDocumentId(),this.state.tags)
        this.toggleModal()
    }



    renderFileBlock() {
        const sorted = _.sortBy(this.props.selectedFile.blocks, 'blockOrder')
        return sorted.map((block, index) => (
            <EditableBlock
                key={`available-blocks-${index}`}
                value={block.summary}
                blockOrder={block.blockOrder}
                isEditing={this.state.isEditing}
            />
        ))
    }

    renderAvailableBlocks() {
        return this.props.selectedFile.availableBlocks.map((value, index) => (
            <EditableBlock key={`available-blocks-${index}`} value={value.summary} />
        ))
    }

    renderEditButton() {
        if (this.state.isEditing) {
            return (
                <FlatButton
                    label="Done"
                    icon={<i className="material-icons">done</i>}
                    onClick={() => this.setState({ isEditing: !this.state.isEditing })}
                />
            )
        } else {
            return (
                <FlatButton
                    label="Edit File"
                    icon={<i className="material-icons">mode_edit</i>}
                    onClick={()=>(this.setState({ isEditing: !this.state.isEditing }))}
                />
            )
        }
    }

    toggleModal(){
        this.setState({modal:!this.state.modal})
    }

    createTag(event){
        
        if(event.key =="Enter" && validateEmail(event.target.value)) {
            this.setState({tags:[...this.state.tags,event.target.value]})
            event.target.value =''
        }  
    }

    deleteKey(key) {
        console.log(key)
        let newState =this.state.tags.filter((tag,index) =>{
            return index !=key
        })
        this.setState({tags:newState})
    }
    renderTags(){
        return this.state.tags.map((tag, index) => {
            return (
                <Chip key ={index} onRequestDelete={() => this.deleteKey(index)}> {tag} </Chip>
            )
        })

    
    }
    renderModal() {
        return (
            <div>
                <Dialog
                    title="Share File with:"
                    modal={true}
                    open={this.state.modal}
                    onRequestClose = {this.toggleModal}
                 >
                 <p> Enter user emails to who you want to share with and hit 'Enter', click the cross to remove emails</p>
                 {this.renderTags()}
                 <TextField onKeyDown= {(e)=>this.createTag(e) } className="tag_input" type="text"/>
                 <FlatButton
                    label="share"
                    onClick={() => this.onShare()}
                />
                <FlatButton
                    label="cancel"
                    onClick={() => this.toggleModal()}
                />
                </Dialog>
            </div>
        )
    }

    renderButtons() {
        return (
            <div className="c-file-content__button">
                {this.renderEditButton()}
                <FlatButton
                    label="Save to PDF"
                    icon={<i className="material-icons">save</i>}
                    onClick={() => this.onSave()}
                />
                <FlatButton
                    label="Export to version"
                    icon={<i className="material-icons">save</i>}
                    onClick={() => this.onSave()}
                />
                <FlatButton
                    label="Share file"
                    icon={<i className="material-icons">share</i>}
                    onClick={() => this.toggleModal()}
                />
            </div>
        )
    }

    renderMessage() {
        return (
            <Snackbar
                open={this.state.hasMessage}
                message={this.state.message}
                autoHideDuration={2000}
            />
        )
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        const fileClassName = classNames('c-file-content__file', {
            'c--active': !this.state.isEditing,
        })
        return (
            <div className="c-file-container">
                {this.renderModal()}
                <div className="c-file-content">
                    {this.renderMessage()}
                    {this.renderButtons()}
                    <TextField
                        defaultValue={this.props.selectedFile.title}
                        floatingLabelText="Title"
                        ref={ref => this.titleNode = ref}
                    />
                    <div className={fileClassName}>
                        {this.renderFileBlock()}
                    </div>
                </div>
                <div className="c-file-blocks">
                    <h3>Your Personal Blocks</h3>
                    {this.renderAvailableBlocks()}
                </div>
            </div>
        )
    }
}

File.propTypes = {
    //dispatchSavePdf: PropTypes.func.isRequired,
    dispatchCreateFile: PropTypes.func.isRequired,
    dispatchUpdateFile: PropTypes.func.isRequired,
    dispatchFetchFile: PropTypes.func.isRequired,
    dispatchSelectFile: PropTypes.func.isRequired,
    dispatchShareFile: PropTypes.func.isRequired,
    user: PropTypes.shape({
        info: PropTypes.shape({
            username: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    selectedFile: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        blocks: PropTypes.arrayOf(PropTypes.shape({
            blockOrder: PropTypes.number.isRequired,
            summary: PropTypes.string.isRequired,
        })).isRequired,
        availableBlocks: PropTypes.arrayOf(PropTypes.shape({
            blockId: PropTypes.string.isRequired,
            summary: PropTypes.string.isRequired,
        })),
        isNew: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = ({ app, user }) => ({
    selectedFile: app.selectedFile,
    user: user,
})


export default withRouter(connect(mapStateToProps, actions)(File))
