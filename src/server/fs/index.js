// //not sure where to put this file
// const rand  = require('randomstring')
// const mdpdf = require('markdown-pdf')
// //const db    = require('../db')

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

// function savePDF(){

// }

// module.exports = {

//     generatePDF: function() {
//         // might need to change charset
//         const filename = rand.generate(6) + '.pdf'
//         let path = genFilePath()

//         //sql to update the db
//         //db.sqlModify()
//         return (filename, path)
//     },

//     // retrievePDF: function() {


//     //     //var full_path_md = path + filename

//     //     // save both md and pdf file
//     //     // fs.createReadStream(full_path_md)
//     //     //   .pipe(markdownpdf(full_path_md))
//     //     //   .pipe(fs.createWriteStream(full_path_pdf))
//     //     const full_path_md = 'leel'
//     //     const full_path_pdf = 'leel'

//     //     mdpdf().from(full_path_md).to(full_path_pdf, function(){
//     //         console.log('done')
//     //     })
//     // },
// }
