import React from 'react';
import { Header, Text, KeyboardSpacer, SizeInput, TextArea, Select } from '../../components';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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
            filesModal: false,
            productsModal: false,
            currentCategory: null
        }
    }

    handleSelectCategory(cat){
        this.setState({
            currentCategory: cat
        })
    }

    getInitialState(){
        const roomState = this.props.roomState || {};
        return {
            width: roomState.width || '',
            height: roomState.height || '',
            depth: roomState.depth || '',
            description: roomState.description || '',
            room: this.props.room || roomState.room || {},
            files: {
                before: [],
                after: [],
                files: []
            }
        }
    }

    getFileCategories(){
        return [
            {type: 'before', label: I18n.t('room.files.before') },
            {type: 'after', label: I18n.t('room.files.after') },
            {type: 'files', label: I18n.t('room.files.files') },
        ]
    }

    toggleFilesModal(){
        this.setState({
            filesModal: !this.state.filesModal
        })
    }

    toggleProductsModal(){
        this.setState({
            productsModal: !this.state.productsModal
        })
    }

    handleBack(){
        this.props.onBack();
    }

    handleFormSubmit(){
        const { width, height, depth, description, room } = this.state;
        const data = {
            width, height, depth, description, room
        }
        this.props.onSave(data);
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

    renderFilesModal(){
        return(
            <Modal
                visible={this.state.filesModal}
                onRequestClose={() => {}}
                animationType={'fade'}
            >
                <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                    <View style={{marginHorizontal:30}}>
                        <View
                            style={{
                                marginVertical:30,
                            }}
                        >
                            <AntDesign 
                                name={'close'}
                                color={secondaryColor}
                                onPress={this.toggleFilesModal.bind(this)}
                                size={24}
                                style={{
                                    alignSelf: 'flex-end'
                                }}
                            />
                        </View>
                        <View style={{marginRight: 20}}>
                            <Text size={16} weight={'semibold'}>{I18n.t('room.files.title')}</Text>
                        </View>
                        <View style={[accountStyle.formRow,{marginTop:20}]}>
                            <View style={[projectStyle.roomInputArea,{marginVertical:0}]}>
                                <View>
                                    <Text style={mainStyle.inputLabel}>{I18n.t('room.files.label')}</Text>
                                    <Select
                                        options={this.getFileCategories()}
                                        onOptionSelected={this.handleSelectCategory.bind(this)}
                                        arrowColor={secondaryColor}
                                        fullWidth
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    renderProductsModal(){
        return(
            <Modal
                visible={this.state.productsModal}
                onRequestClose={() => {}}
                animationType={'fade'}
            >

            </Modal>
        )
    }

    render(){
        const { room } = this.state;
        return(
            <View style={{flex:1}}>
                {this.renderFilesModal()}
                {this.renderProductsModal()}
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
                                        <TouchableOpacity onPress={this.toggleFilesModal.bind(this)} style={projectStyle.addClientClickArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                            <Text style={projectStyle.addClientText}>{' '}{I18n.t('room.add')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginHorizontal: 10, marginVertical: 20}}>
                                <View style={projectStyle.clientLabelArea}>
                                    <Text style={projectStyle.projectFilesText}>{I18n.t('room.products')}</Text>
                                    <View style={[projectStyle.addClientArea,{paddingRight:0}]}>
                                        <TouchableOpacity onPress={() => {}} style={projectStyle.addClientClickArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                            <Text style={projectStyle.addClientText}>{' '}{I18n.t('room.add')}</Text>
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