import types from '../actions/types'

/**
 * Initial State of the files
 * Array of File Object
 *      @property {string} doc_id
 *      @property {string} title
 *      @property {array} comments
 *      @property {array} blocks
 *      @property {number} version
 *
 * @example
 *  doc_id: '1'
 *  title: 'File name 1'
 *  comments: ['first', 'seconds comment']
 *  blocks: ['_markdown_']
 *  version: 1
 */
const initState = []

const findFile = (files, id) => {
    const index = files.findIndex((file) => (file.doc_id === id))
    return {
        file: files[index],
        index: index,
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_FILES_SUCCESS: {
            const files = [...action.payload.files]
            return files
        }
        case types.FETCH_FILES_FAILURE:
            return []
        // Comments
        case types.RECEIVE_COMMENT:
        case types.CREATE_COMMENT_SUCCESS: {
            const { file, index } = findFile(state, action.payload.id)
            if (index === -1) {
                return state
            }
            let newFile = { ...file }
            if (newFile.comments) {
                newFile.comments.push(action.payload.comment)
            } else {
                newFile.comments = [ action.payload.comment ]
            }
            let newState = [ ...state ]
            newState[index] = newFile
            return newState
        }
        default:
            return state
    }
}
