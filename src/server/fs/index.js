//not sure where to put this file
const rand  = require('randomstring')
const mdpdf = require('markdown-pdf')
const { Document } = require('../models/document')
const { Block } = require('../models/block')
const fs = require('fs')
//path to where file system is located
let fs_path = '/home/ubuntu/files/'

function genFilePath(){
    const options = {
        length: 1,
        charset: '123',
    }
    let path = fs_path +
               rand.generate(options) + '/' +
               rand.generate(options) + '/' +
               rand.generate(options) + '/'
    return path
}


module.exports = {

    generatePDF: function(doc_id) {
        return new Promise(function(resolve, reject){
            // might need to change charset
            const filename = rand.generate(6) + '.pdf'
            let path = genFilePath()
            let md = ''

            Block.GetBlocks(doc_id).then((blocks, err) => {
                if (err){
                    throw(err)
                }
                else{
                    //parse this
                    md = blocks
                    return Document.UpdateDocumentFilepath(doc_id, path, filename)
                }
            }).then((result, err) => {
                if (err){
                    console.error(err)
                    throw(err)
                }
                else{
                    const full_path_pdf = path + filename
                    console.log(full_path_pdf)

                    mdpdf().from.string(md).to(full_path_pdf, function(){
                        console.log('PDF File created')
                    })
                    resolve(result)
                }
            }).catch((exception) => {
                console.error(exception)
                reject({ error_message : 'Error'})
            })
        })
    },

    //WIP
    retrievePDF: function(doc_id) {
        return new Promise((resolve, reject) => {
            Document.FindFilepathByDocid(doc_id).then((filepath, err) => {
                if (err){
                    throw(err)
                }
                else{
                    fs.readFile(filepath, function (error, result){
                        if (error){
                            throw(error)
                        }
                        else{
                            //TODO
                            resolve(result)
                        }
                    })
                }
            }).catch((error) => {
                console.error(error)
                reject({ error_message : 'Error retrieving pdf file'})
            })
        })
    },
}
