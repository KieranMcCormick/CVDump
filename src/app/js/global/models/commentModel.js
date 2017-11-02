
class CommentModel {

    constructor (id){
        this.comments = []
        this.resumeId =id


        this.getComments = function(){
            fetchComments()
            return this.comments
        }


        this.deleteComments = function(){
            console.log('does nothing')
        }

        this.createComment = function(user,timeStamp,content){
            if (user !=null && timeStamp !=null) {
                let  newComment = Comment(user,content,timeStamp,this.resumeId)
                this.comments.push(newComment)
                syncComments()

            }
        }


        function syncComments(){
            //Make post request to update comment
            if (this.comments){
                console.log('Server updated')
            }
        }

        function fetchComments () {
            //make GET request to get all the comments;
            // for testing purposes only
            let dummyMethod =  {data: this.state.newInput , date:'just now' , author:'me'}
            this.comments.push()
        }




    }



}

class Comment {
    constructor (user,content,timeStamp,resumeId){
        this.user=user
        this.content=content
        this.timeStamp=timeStamp
        this.resumeId = resumeId
    }
}


export default CommentModel
