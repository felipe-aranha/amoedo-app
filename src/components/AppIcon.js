import React from 'react';
import { Image } from 'react-native';


export default class AppIcon extends React.PureComponent{
    getSource(){
        const { name, large } = this.props;
        switch(name){
            case 'email':
                return large ? 
                    require('../../assets/images/icons/email-x2.png'):
                    require('../../assets/images/icons/email.png');
                    
            case 'password':
                return large ? 
                    require('../../assets/images/icons/password-x2.png'):
                    require('../../assets/images/icons/password.png');
            case 'personal-data':
                return large ? 
                    require('../../assets/images/icons/personal-data-x2.png'):
                    require('../../assets/images/icons/personal-data.png');
            case 'professional-data':
                return large ? 
                    require('../../assets/images/icons/professional-data-x2.png'):
                    require('../../assets/images/icons/professional-data.png');
            case 'upload-files':
                return large ? 
                    require('../../assets/images/icons/upload-files-x2.png'):
                    require('../../assets/images/icons/upload-files.png');
            case 'camera':
                return large ? 
                    require('../../assets/images/icons/camera-x2.png'):
                    require('../../assets/images/icons/camera.png');
            case 'clients':
                    return large ? 
                        require('../../assets/images/icons/client-menu.png'):
                        require('../../assets/images/icons/client-menu.png');
            case 'chat':
                return large ? 
                    require('../../assets/images/icons/chat-menu.png'):
                    require('../../assets/images/icons/chat-menu.png');
            case 'list':
                return large ? 
                    require('../../assets/images/icons/list-menu.png'):
                    require('../../assets/images/icons/list-menu.png');
            case 'logout':
                return large ? 
                    require('../../assets/images/icons/logout-menu.png'):
                    require('../../assets/images/icons/logout-menu.png');
            case 'occurrence':
                return large ? 
                    require('../../assets/images/icons/occurrence-menu.png'):
                    require('../../assets/images/icons/occurrence-menu.png');
            case 'settings':
                return large ? 
                    require('../../assets/images/icons/settings-menu.png'):
                    require('../../assets/images/icons/settings-menu.png');
            case 'calendar': 
                return large ?
                require('../../assets/images/icons/calendar-x2.png'):
                require('../../assets/images/icons/calendar-x2.png');
            case 'check': 
                return large ?
                require('../../assets/images/icons/check-x2.png'):
                require('../../assets/images/icons/check-x2.png');
            case 'check-warning': 
                return large ?
                require('../../assets/images/icons/check-warning-x2.png'):
                require('../../assets/images/icons/check-warning-x2.png');
            case 'points': 
                return large ?
                require('../../assets/images/icons/points-menu-x2.png'):
                require('../../assets/images/icons/points-menu-x2.png');
            case 'client': 
                return large ?
                require('../../assets/images/icons/client-x2.png'):
                require('../../assets/images/icons/client-x2.png');
            default:
                return false;
        }
    }

    small = {
        width: 8,
        height: 8
    }

    medium = { 
        width: 16,
        height: 16
    }

    render(){
        const source = this.getSource();
        const size = this.props.small ? this.small : this.medium
        if(!source) return <></>;
        return <Image 
            source={source}
            style={[size,this.props.style]}
            resizeMode={this.props.resizeMode || 'contain'}
        />
    }
}