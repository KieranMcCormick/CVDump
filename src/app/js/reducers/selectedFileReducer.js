import types from '../actions/types'

const initState = {
    id: '',
    title: '',
    availableBlocks: [],
    blocks: [],
    comments: [],
    pdf: '',
}

const reorder = (blocks) => {
    return blocks.map((block, index) => ({
        summary: block.summary,
        blockOrder: index + 1,
    }))
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.SELECT_FILE:
            return {
                id: action.payload,
                title: '',
                availableBlocks: [],
                blocks: [],
                comments: [],
                pdf: '',
            }
        case types.FETCH_FILE_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case types.FETCH_FILE_FAILURE:
            return state

        // Files view
        case types.ADD_BLOCK_TO_SELECTED_FILE: {
            const newBlock = {
                blockOrder: state.blocks.length + 1,
                summary: action.payload,
            }
            return {
                ...state,
                blocks: [
                    ...state.blocks,
                    newBlock
                ],
            }
        }
        case types.REMOVE_BLOCK_FROM_SELECTED_FILE: {
            let newBlocks = state.blocks.filter(block => block.blockOrder !== action.payload)
            newBlocks = reorder(newBlocks)
            return {
                ...state,
                blocks: newBlocks,
            }
        }
        case types.MOVE_BLOCK_FROM_SELECTED_FILE:{
            // 1-based index
            const swapIndex = action.payload.blockOrder + action.payload.delta
            if (swapIndex > state.blocks.length || swapIndex === 0) {
                return state
            }
            let newBlocks = [ ...state.blocks]
            newBlocks[swapIndex - 1] = {
                ...state.blocks[action.payload.blockOrder - 1],
                blockOrder: swapIndex,
            }
            newBlocks[action.payload.blockOrder - 1] = {
                ...state.blocks[swapIndex - 1],
                blockOrder: action.payload.blockOrder,
            }
            return {
                ...state,
                blocks: newBlocks,
            }
        }

        // Shares view
        case types.FETCH_SHARE_FILE_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case types.RECEIVE_COMMENT:
        case types.CREATE_COMMENT_SUCCESS: {
            return {
                ...state,
                comments: [
                    ...state.comments,
                    action.payload.comment
                ],
            }
        }
        default:
            return state
    }
}
