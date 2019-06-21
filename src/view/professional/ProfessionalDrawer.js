import React from 'react';
import { View } from 'react-native'
import { MainContext } from '../../reducer';
import { Text, GradientButton } from '../../components';
import { drawerStyle } from '../../style';
import { MaterialIcons } from '@expo/vector-icons';

export default class ProfessionalDrawer extends React.PureComponent{

    static contextType = MainContext;

    render(){
        return(
            <View style={{flex:1}}>
                <View style={drawerStyle.accountArea}>
                    <View
                        style={drawerStyle.avatarArea}
                    >
                        <View style={drawerStyle.checkArea}>
                            <GradientButton 
                                vertical
                                colors={['rgb(170,4,8)','rgb(226,0,6)']}
                                width={32}
                                height={32}
                                title={<MaterialIcons size={18} name={'check'} />}
                                titleStyle={drawerStyle.editText}
                            />
                        </View>
                    </View>
                    <Text
                        numOfLines={1}
                        style={drawerStyle.userName}
                    >
                        Alfredo Dias
                    </Text>
                    <Text
                        style={drawerStyle.userType}
                    >
                        ARQUITETO
                    </Text>
                    <GradientButton 
                        vertical
                        colors={['rgb(170,4,8)','rgb(226,0,6)']}
                        width={80}
                        height={36}
                        title={'Editar'}
                        titleStyle={drawerStyle.editText}
                    />
                </View>
                <View style={{flex:2}}>
                </View>
                <View style={{flex:1}}>

                </View>
            </View>
        )
    }
}