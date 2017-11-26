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
            NotificationHandler.createNotification('comment',notification)
              
            }
        )
        }    
    }

    //Links to relevant page and deletes notification
    resolveNotification(type,docId) {
        if(type =='comment'){
            let routePath = "/files/" +docId
            this.props.history.push(routePath);
            this.setState({dropdown:false})
        } else {
            this.props.history.push('/');
        }
    }

    renderNotificationCards() {
        if(this.props.notifications.length >0){
            return this.props.notifications.map((notice, index) => {
                console.log(notice)
                if (notice.type =="comment"){
                    let caption = "New comment on "  +notice.file 
                    let subtitle = notice.timeStamp.substring(0,10)

                    return <Card >
                             <CardHeader
                                title={caption}
                                subtitle={subtitle}
                                actAsExpander={true}
                                />
                             <CardActions>
                                 <FlatButton onClick={()=>this.resolveNotification(notice.type,notice.document_id)} label="View"/>
                                 <FlatButton label="Remove"/>
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
    dispatchFetchNotifications: PropTypes.func.isRequired,
}


const mapStateToProps = ({ user,app }) => ({
    user,
    notifications: app.notifications,
})


export default withRouter(connect(mapStateToProps,actions)(NotificationsView))
