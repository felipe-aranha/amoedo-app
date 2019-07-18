import React from 'react';
import { Header, Text, KeyboardSpacer, SizeInput, TextArea, Select, MediaSelect } from '../../components';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, Image, Share, Platform } from 'react-native';
import { accountStyle, secondaryColor, mainStyle, projectStyle } from '../../style';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n';
import { AntDesign } from '@expo/vector-icons';
import { Button, ButtonGroup } from 'react-native-elements';
import Catalog from '../catalog/Catalog';

export default class Room extends React.PureComponent {

    constructor(props,context){
        super(props,context);
        this.state = {
            ...this.getInitialState(),
            index: this.props.index || -1,
            filesModal: false,
            productsModal: false,
            currentCategory: null,
            fileIndex: 0
        }
    }

    handleCatalogChange(cart){
        console.log(cart);
        this.toggleProductsModal();
    }

    getFiles(){
        const { fileIndex, files } = this.state;
        const category = this.getFileCategories()[fileIndex].type;
        return files[category];
    }

    handleSelectCategory(cat){
        this.setState({
            currentCategory: cat
        })
    }

    updateFilesIndex(fileIndex){
        this.setState({fileIndex})
    }

    getInitialState(){
        const roomState = this.props.roomState || {};
        return {
            width: roomState.width || '',
            height: roomState.height || '',
            depth: roomState.depth || '',
            description: roomState.description || '',
            room: this.props.room || roomState.room || {},
            files: roomState.files || {
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

    getFileOptions(){
        return [
            {type: 'delete', label: I18n.t('room.files.delete')},
            {type: 'share', label: I18n.t('room.files.share')}
        ]
    }

    handleFileOptionSelected(option){
        switch(option.type){
            case 'delete':
                this.handleDelete(option.file);
                break;
            case 'share':
                this.handleShare(option.file);
        }
    }

    handleDelete(f){
        console.log(f);
        let files = Object.assign({},this.state.files);
        Object.keys(files).forEach(cat => {
            files[cat] = files[cat].filter(file => file.uri != f.uri) || [];
        });
        console.log(files);
        this.setState({
            files
        })
    }

    handleShare(file){
        const data = {}
        if(Platform.OS == 'ios'){
            data.url = file.uri
        } else {
            data.message = file.uri
        }
        Share.share(data);
    }

    toggleFilesModal(){
        this.setState({
            filesModal: !this.state.filesModal,
            currentCategory: null
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
        const { width, height, depth, description, room, files } = this.state;
        const data = {
            width, height, depth, description, room, files
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

    handleSelectMedia(media){
        if(media.cancelled) return;
        const { currentCategory } = this.state;
        if(currentCategory != null){
            const files = Object.assign({},this.state.files);
            files[currentCategory.type].push({
                uri: media.uri,
                process: true,
                description: ''
            });
            this.setState({
                files
            })
        }
    }

    renderFilesModal(){
        return(
            <Modal
                visible={this.state.filesModal}
                onRequestClose={() => {}}
                animationType={'fade'}
            >
                <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                    <View style={{marginHorizontal:30, flex:1}}>
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
                        {this.state.currentCategory != null &&
                        <ScrollView>
                            <View style={{
                                flexWrap: 'wrap',
                                flexDirection: 'row'
                            }}>
                                <>
                                    {this.state.files[this.state.currentCategory.type] && this.state.files[this.state.currentCategory.type].map((file,index) => {
                                        return(
                                            <View
                                                style={projectStyle.roomAddPhotoArea}
                                                key={index}
                                            >
                                                <Image 
                                                    style={{
                                                        width: 100,
                                                        height:100,
                                                    }}
                                                    resizeMode={'contain'}
                                                    source={{uri:file.uri}}
                                                />
                                            </View>
                                        )
                                    })}
                                    <MediaSelect
                                        onMediaSelected={this.handleSelectMedia.bind(this)}
                                        denyEdit
                                    >
                                        <View style={projectStyle.roomAddPhotoArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={secondaryColor} />
                                            <Text style={{textAlign:'center'}} size={12} weight={'medium'}>{I18n.t('room.files.newImage')}</Text>
                                        </View>
                                    </MediaSelect>
                                </>
                            </View>
                        </ScrollView>
                        }
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginBottom: 30
                        }}>
                            <Button 
                                title={I18n.t('room.save')}
                                containerStyle={accountStyle.accountTypeButtonContainer}
                                buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.buttonSecondary]}
                                titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                                onPress={this.handleFormSubmit.bind(this)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render(){
        const { room } = this.state;
        const files = this.getFiles();
        if(this.state.productsModal)
            return (
                <Catalog 
                    onBack={this.handleCatalogChange.bind(this)}
                />
            )
        return(
            <View style={{flex:1}}>
                {this.renderFilesModal()}
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
                                <View style={{marginTop:10}}>
                                    <ButtonGroup 
                                        onPress={this.updateFilesIndex.bind(this)}
                                        selectedIndex={this.state.fileIndex}
                                        buttons={this.getFileCategories().map(cat => cat.label)}
                                        containerStyle={{
                                            borderRadius: 10
                                        }}
                                        selectedButtonStyle={{
                                            backgroundColor: secondaryColor
                                        }}
                                        selectedTextStyle={{
                                            color: '#fff',
                                            fontSize: 12,
                                            fontFamily: 'system-medium'
                                        }}
                                        textStyle={{
                                            color: secondaryColor,
                                            fontSize: 12,
                                            fontFamily: 'system-medium'
                                        }}
                                    />
                                </View>
                                {files.length > 0 &&
                                    <ScrollView 
                                        horizontal   
                                        style={{
                                            marginVertical: 10,
                                        }}
                                    >
                                        {files.map((file,idx) => {
                                            let options = this.getFileOptions().map(option => {
                                                option.file = file;
                                                return option;
                                            })
                                            return( <View 
                                                key={idx.toString()}
                                                style={{
                                                    padding: 5,
                                                    paddingBottom: 0,
                                                    margin: 5,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 5
                                                }}
                                            >
                                                <Image 
                                                    source={{
                                                        uri: file.uri
                                                    }}
                                                    style={{
                                                        width: 110,
                                                        height: 70
                                                    }}
                                                    resizeMode={'contain'}
                                                />
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent:'flex-end'
                                                    }}
                                                >
                                                        <Select
                                                            options={options}
                                                            onOptionSelected={this.handleFileOptionSelected.bind(this)}
                                                        >
                                                            <View
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: secondaryColor,
                                                                    borderRadius: 10,
                                                                    width: 20,
                                                                    height:20,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <AntDesign 
                                                                    name={'ellipsis1'}
                                                                    color={secondaryColor}
                                                                />
                                                            </View>
                                                        </Select>
                                                </View>
                                            </View> )
                                        })}
                                    </ScrollView>
                                }
                            </View>
                            <View style={{marginHorizontal: 10, marginVertical: 20}}>
                                <View style={projectStyle.clientLabelArea}>
                                    <Text style={projectStyle.projectFilesText}>{I18n.t('room.products')}</Text>
                                    <View style={[projectStyle.addClientArea,{paddingRight:0}]}>
                                        <TouchableOpacity onPress={this.toggleProductsModal.bind(this)} style={projectStyle.addClientClickArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                            <Text style={projectStyle.addClientText}>{' '}{I18n.t('room.add')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginTop: 20,marginBottom:50}}>
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