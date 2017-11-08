
class CommentModel {

    constructor (id){
<<<<<<< HEAD
        this.comments = []
        this.resumeId =id


        this.getComments = function(){
            fetchComments()
            return this.comments
=======
       this.comments = [];
       this.resumeId =id;


       this.getComments = function(){
           fetchComments();
           return this.comments;
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d
        }


        this.deleteComments = function(){
<<<<<<< HEAD
            console.log('does nothing')
        }

        this.createComment = function(user,timeStamp,content){
            if (user !=null && timeStamp !=null) {
                let  newComment = Comment(user,content,timeStamp,this.resumeId)
                this.comments.push(newComment)
                syncComments()

            }
=======
           console.log("does nothing");
        }

        this.createComment = function(user,timeStamp,content){
           if (user !=null && timeStamp !=null) {
               var  newComment = Comment(user,content,timeStamp,this.resumeId);
               this.comments.push(newComment);
               syncComments();

           }
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d
        }


        function syncComments(){
            //Make post request to update comment
            if (this.comments){
<<<<<<< HEAD
                console.log('Server updated')
            }
        }

        function fetchComments () {
            //make GET request to get all the comments;
            // for testing purposes only
            let dummyMethod =  {data: this.state.newInput , date:'just now' , author:'me'}
            this.comments.push()
        }
=======
                console.log("Server updated");
            }
        }

       function fetchComments () {
           //make GET request to get all the comments;
           // for testing purposes only
           var dummyMethod =  {data: this.state.newInput , date:"just now" , author:"me"};
           this.comments.push()
       }
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d




<<<<<<< HEAD
    }
=======
    };
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d



}

class Comment {
    constructor (user,content,timeStamp,resumeId){
<<<<<<< HEAD
        this.user=user
        this.content=content
        this.timeStamp=timeStamp
        this.resumeId = resumeId
=======
        this.user=user;
        this.content=content;
        this.timeStamp=timeStamp;
        this.resumeId = resumeId;
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d
    }
}


<<<<<<< HEAD
export default CommentModel
=======
export default CommentModel;
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d
