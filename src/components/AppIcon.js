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