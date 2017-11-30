//not sure where to put this file
const rand  = require('randomstring')
const mdpdf = require('markdown-pdf')
const { Document } = require('../models/document')
const { DocumentBlock } = require('../models/documentblock')
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

    /*Checks that file belongs to user and file path not already created*/
    generatePDF: function(doc_id) {
        return new Promise(function(resolve, reject){

            let update_flag = false
            let filename = ''
            let filepath = ''
            let md = ''
            let path = ''

            Document.FindFilepathByDocid(doc_id).then((res, err) => {
                if (err){
                    throw(err)
                }
                else if (res[0].filepath != ''){ //filepath already exists
                    filename = res[0].filename
                    filepath = res[0].filepath
                    update_flag = true
                }
                else{ //create new filepath
                    filename = rand.generate(6) + '.pdf'
                    path = genFilePath()
                }
                return DocumentBlock.GetBlocks(doc_id)

            }).then((blocks, err) => {
                console.log(filename)
                if (err){
                    throw(err)
                }
                else{
                    md = blocks
                    if (update_flag) {
                        console.log('NO FILE PATH EXISTS YET')
                        Document.UpdateDocumentFilepath(doc_id, filepath, filename)
                    }
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
                    fs.readFile(fs_path+filepath, function (error, result){
                        if (error){
                            throw(error)
                        }
                        else{
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
