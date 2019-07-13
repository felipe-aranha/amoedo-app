import React from 'react';
import { Header, Text, KeyboardSpacer, SizeInput, TextArea } from '../../components';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { accountStyle, secondaryColor, mainStyle, projectStyle } from '../../style';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

export default class Room extends React.PureComponent {

    constructor(props,context){
        super(props,context);
        this.state = {
            ...this.getInitialState(),
            index: this.props.index || -1,
        }
    }

    getInitialState(){
        const roomState = this.props.roomState || {};
        return {
            width: roomState.width || '',
            height: roomState.height || '',
            depth: roomState.depth || '',
            description: roomState.description || '',
            room: this.props.room || roomState.room || {}
        }
    }

    handleBack(){
        this.props.onBack();
    }

    handleFormSubmit(){
        this.props.onSave(this.state);
    }

    handleWidthChange(width){
        this.setState({width})
    }
    
    handleHeightChange(height){
        this.setState({height})
    }

    handleDepthChange(depth){
        this.setState({depth})
    }

    handleDescChange(description){
        this.setState({description})
    }

    render(){
        const { room } = this.state;
        return(
            <View style={{flex:1}}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    title={I18n.t('section.room')}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={'rgb(103,4,28)'}
                />
                <View
                    style={{
                        backgroundColor: secondaryColor,
                        paddingHorizontal:20,
                        paddingVertical: 10
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontFamily: 'system-medium',
                        fontSize: 14
                    }}>{room.label.toUpperCase()}</Text>
                </View>
                <View style={{flex:1}}>
                    <ScrollView style={{
                        paddingHorizontal: 10
                    }}>
                        <View>
                            <View style={projectStyle.roomInputArea}>
                                <Text style={mainStyle.inputLabel}>{I18n.t('room.width')}</Text>
                                <SizeInput 
                                    value={this.state.width}
                                    onChangeText={this.handleWidthChange.bind(this)}
                                />
                            </View>
                            <View style={projectStyle.roomInputArea}>
                                <Text style={mainStyle.inputLabel}>{I18n.t('room.height')}</Text>
                                <SizeInput 
                                    value={this.state.height}
                                    onChangeText={this.handleHeightChange.bind(this)}
                                />
                            </View>
                            <View style={projectStyle.roomInputArea}>
                                <Text style={mainStyle.inputLabel}>{I18n.t('room.depth')}</Text>
                                <SizeInput 
                                    value={this.state.depth}
                                    onChangeText={this.handleDepthChange.bind(this)}
                                />
                            </View>
                            <View style={[accountStyle.formRow,projectStyle.roomInputBorder]}>
                                <TextArea 
                                    value={this.state.description}
                                    onChangeText={this.handleDescChange.bind(this)}
                                    label={<>{I18n.t('room.description')}<Text style={{width: 20,paddingVertical:10}}>{' '}</Text></>}
                                />
                            </View>
                            <View style={{marginHorizontal: 10}}>
                                <View style={projectStyle.clientLabelArea}>
                                    <Text style={projectStyle.projectFilesText}>{I18n.t('room.projectFiles')}</Text>
                                    <View style={[projectStyle.addClientArea,{paddingRight:0}]}>
                                        <TouchableOpacity onPress={() => {}} style={projectStyle.addClientClickArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                            <Text style={projectStyle.addClientText}>{' '}{I18n.t('room.addFile')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginVertical: 20}}>
                                <Button 
                                    title={I18n.t('room.save')}
                                    containerStyle={accountStyle.accountTypeButtonContainer}
                                    buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.projectSaveButton]}
                                    titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                                    onPress={this.handleFormSubmit.bind(this)}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <KeyboardSpacer />
            </View>
        )
    }
}