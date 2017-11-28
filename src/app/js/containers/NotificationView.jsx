import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Logo } from '../global/icon'
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Menu from 'material-ui/Menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../actions'
import SocketHandler from '../global/socketsHandler'
import NotificationHandler from '../global/notificationHandler'
import { Redirect } from 'react-router';

class NotificationsView extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            dropdown: false,
            dropdownAnchor: null,
        }
    }
    componentDidMount(){
        let that = this
        if(this.props.user.isAuthenticated) {
            this.props.dispatchFetchNotifications(this.props.user.info.email)
            SocketHandler.joinRoom(
            "notifications",
             this.props.user.info.username,
            )
            
        SocketHandler.listen(
            'notifications',
            'notify',
            (notification) => {
                //Triggers the state change for notifications
            
            this.props.dispatchReceiveNotification(notification)
            NotificationHandler.createNotification('comment',notification,function(notification){
                console.log(notification)
                that.props.dispatchFetchFiles()
                that.props.dispatchResolveNotification(notification.uuid)
                let routePath = "/files/" +notification.document_id
                that.props.history.push(routePath);
            })
              
            }
        )
        }    
    }

    //Links to relevant page and deletes notification
    resolveNotification(notice,route) {
        console.log(notice)
        //fixes bug where user directly routes to file page before client fetchesFiles
        this.props.dispatchFetchFiles()
        this.props.dispatchResolveNotification(notice.uuid)
        if(route) {
            let routePath = "/files/" +notice.document_id
            this.props.history.push(routePath);
            this.setState({dropdown:false})
        }    
      
    }
    

    renderNotificationCards() {
        if(this.props.notifications.length >0){
            return this.props.notifications.map((notice, index) => {
                
                if (notice.type =="comment"){

                    let caption = notice.file ? "New comment on "  + notice.file : "New comment from " +notice.sender
                    let subtitle = notice.timeStamp.substring(0,10)
                    return <Card >
                             <CardHeader
                                title={caption}
                                subtitle={subtitle}
                                actAsExpander={true}
                                />
                             <CardText>
                                 {notice.content}   
                             </CardText>    
                             <CardActions>
                                 <FlatButton onClick={()=>this.resolveNotification(notice,true)} label="View"/>
                                 <FlatButton onClick={()=>this.resolveNotification(notice,false)}label="Remove"/>
                             </CardActions>   

                                
                            </Card> 
                }
            
            })
        }

    }
    
    showNotifications = (event)=> {
        this.setState({dropdown:!this.state.dropdown,
        dropdownAnchor:event.currentTarget})
    }
    
    renderNotificationCount() {
        return (
            <div>
                <Badge
                className ="c-status-bar__notification_count"
                badgeContent={this.props.notifications.length}
                secondary={true}
                badgeStyle={{top: 20, right: 20}}
                >
               <IconButton tooltip="Notifications" onClick ={(event)=>this.showNotifications(event)}>
                   <NotificationsIcon />
                   </IconButton> 
               </Badge>
               <Drawer
                    className="c-status-bar__notification_drawer"
                    open={this.state.dropdown}
                    docked={false}
                    openSecondary={true}
                    onRequestChange={(dropdown) => this.setState({dropdown})}
                    >
                     
                       <Menu>
                         {this.renderNotificationCards()}
                       </Menu>
                </Drawer> 
              
            
         </div>
        )
    }

    render() {
        return (
            <div className="c-notifications">
                {this.renderNotificationCount()}
            </div>
        )
    }
}

NotificationsView.propTypes = {
    user: PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        info: PropTypes.object.isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    notifications: PropTypes.any.isRequired,
    dispatchReceiveNotification: PropTypes.func.isRequired,
    dispatchResolveNotification:PropTypes.func.isRequired,
    dispatchFetchNotifications: PropTypes.func.isRequired,
    dispatchFetchFile: PropTypes.func.isRequired,
}


const mapStateToProps = ({ user,app }) => ({
    user,
    notifications: app.notifications,
})


export default withRouter(connect(mapStateToProps,actions)(NotificationsView))
