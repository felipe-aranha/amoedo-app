import React from 'react';
import { MainView } from '../MainView';
import { View, TouchableOpacity } from 'react-native';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import AccountStyle from '../../style/AccountStyle';
import { Header, Avatar } from 'react-native-elements';
import { secondaryColor, tertiaryColor } from '../../style';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components';

export default class RoomView extends MainView{

    static contextType = MainContext;

    barStyle = 'light-content';

    constructor(props,context){
        super(props,context);
        this.state = {
            
        }
    }

    isProfessional(){
        return this.context.user.isProfessional;
    }

    renderSearch(){
        return <></>
    }

    renderBackIcon(){
        return(
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    hitSlop={{
                        top:20,
                        bottom: 20,
                        left:20,
                        right:20
                    }}
                    onPress={this.handleBack.bind(this)}
                    style={{
                        marginLeft: 10
                    }}
                >
                    <Ionicons 
                        name={'ios-arrow-round-back'}
                        color={tertiaryColor}
                        size={40}
                    />
                </TouchableOpacity>
                {this.renderTitle()}
            </View>
        )
    }

    renderTitle(){
        const { roommate } = this.props;
        return(
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                <Avatar 
                    rounded
                    source={{ uri: roommate.avatar }}
                    avatarStyle={{ width: 40, height: 40, borderRadius: 20, resizeMode: 'cover' }}
                    containerStyle={{ marginHorizontal: 20 }}
                />
                <Text color={'#fff'} weight={'medium'} size={14} >{roommate.name}</Text>
            </View>
        )
    }

    renderCenter(){
        const { roommate } = this.props;
        return(
            <View style={{
                flex:1
            }}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    handleBack={this.handleBack.bind(this)}
                    backgroundColor={secondaryColor}
                    leftComponent={this.renderBackIcon()}
                />
            </View>
        )
    }

}