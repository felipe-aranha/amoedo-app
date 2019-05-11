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
                    
            default:
                return false;
        }
    }

    small = {
        width: 10,
        height: 10
    }

    medium = { 
        width: 20,
        height: 20
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