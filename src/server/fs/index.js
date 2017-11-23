// //not sure where to put this file
// const rand  = require('randomstring')
// const mdpdf = require('markdown-pdf')
// const { Document } = require('../models/document')
// const { Block } = require('../models/block')
// const fs = require('fs')
// //path to where file system is located
// const fs_path = '/home/ubuntu/files/'


// function genFilePath(){
//     const options = {
//         length: 1,
//         charset: '123',
//     }
//     let path = fs_path +
//                rand.generate(options) + '/' +
//                rand.generate(options) + '/' +
//                rand.generate(options) + '/'
//     return path
// }


// module.exports = {

//     generatePDF: function(doc_id) {
//         // might need to change charset
//         const filename = rand.generate(6) + '.pdf'
//         let path = genFilePath()

//         Block.GetBlocks(doc_id).then((blocks, err) => {
//             if (err){
//                 console.error(err)
//                 blocks.send({ message : 'Something went wrong getting the document' })
//             }
//             else{
//                 //parse this
//                 const md = blocks
//                 Document.UpdateDocumentFilepath(doc_id, path, filename).then((result, err) => {
//                     if (err){
//                         console.error(err)
//                         result.send({ message : 'Something went wrong updating file' })
//                     }
//                     else{
//                         const full_path_pdf = path + filename
//                         mdpdf().from.string(md).to(full_path_pdf, function(){
//                             console.log('done')
//                             result.send('PDF File created')
//                         })

//                     }
//                 }).catch((exception) => {
//                     console.error(exception)
//                     result.send({ message : 'Something went wrong loading files' })
//                 })
//             }
//         }).catch((exception) => {
//             console.error(exception)
//             res.send({ message : 'Something went wrong fetching document blocks' })
//         })
//     },

//     retrievePDF: function(doc_id) {

//         Document.FindFilepathByDocid(doc_id).then((filepath, err) => {
//             if (err){
//                 console.error(err)
//                 filepath.send({ message : 'Something went wrong updating file' })
//             }
//             else{
//                 fs.readFile(filepath, function (err, res){
//                     res.contentType('application/pdf')
//                     res.send(res)
//                 })
//                 ///TODO
//                 filepath.send()
//             }
//         }).catch((exception) => {
//             console.error(exception)
//             //res.send({ message : 'Something went wrong loading files' })
//         })
//     },
// }
