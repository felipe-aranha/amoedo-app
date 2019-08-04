import React from 'react';
import { View, ScrollView, Modal, TouchableOpacity, FlatList } from 'react-native';
import Projects from './Projects';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';
import { MainView } from '../MainView';
import { accountStyle, secondaryColor, projectStyle, mainStyle, drawerStyle } from '../../style';
import { Header, Select, Text, KeyboardSpacer, GradientButton } from '../../components';
import { getProjectTypes } from '../../utils';
import { MainContext } from '../../reducer';
import { Input, TextArea, DatePicker } from '../../components/input';
import { AntDesign } from '@expo/vector-icons';
import { Button, ListItem } from 'react-native-elements';
import { UserService } from '../../service/firebase/UserService';
import Room from './Room';

export default class AddProject extends MainView{

    barStyle = 'light-content';

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.projects = getProjectTypes();
        const project = this.props.project ||  {};
        const clientSelected = context.user.clients.find(client => client.email == project.customer);
        if(clientSelected){
            clientSelected.label = clientSelected.name
        }
        const projectType = project.data ? this.projects.find(p => p.name == project.data.type) : null;
        const data = project.data || {};
        this.state = {
            loading: false,
            projectType,
            room: null,
            clientSelected,
            clients: context.user.clients,
            roomModal: false,
            projectName: data.name || '',
            summary: data.summary || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            id: project.id || null,
            rooms: data.rooms || [],
            currentRoom: -1
        }
    }

    handleRoomSave(state){
        const room = Object.assign({},state);
        const rooms = this.state.rooms.slice(0);
        if(this.state.currentRoom > -1){
            rooms[this.state.currentRoom] = room;
        }
        else rooms.push(room);
        this.setState({
            currentRoom: -1,
            roomModal: false,
            rooms
        })
    }

    isEditing(){
        return this.state.id != null;
    }

    getInitialState(){
        const project = this.props.project ||  {};
        
    }

    handleTypeSelect(projectType){
        this.setState({projectType})
    }

    handleClientSelect(clientSelected){
        this.setState({clientSelected})
    }

    toggleRoomModal(currentRoom=-1){
        this.setState({
            currentRoom,
            roomModal: !this.state.roomModal
        })
    }

    handleSelectRoom(room){
        this.setState({
            room
        },() => {
            this.toggleRoomModal()
        })
    }

    getClients(){
        return this.state.clients.map( client => {
            return {
                ...client,
                label: client.name,
            }
        })
    }


    handleProjectNameChange(projectName){
        this.setState({projectName})
    }

    handleSummaryChange(summary){
        this.setState({summary})
    }

    handleStartDateChange(startDate){
        this.setState({startDate})
    }

    handleEndDateChange(endDate){
        this.setState({endDate})
    }

    getFilesForUpload(){
        let files = [];
        this.state.rooms.forEach(room => {
            Object.keys(room.files).forEach(cat => {
                category = room.files[cat];
                const found = category.filter( file => file.process )
				found.forEach(f => {
                    if(f && f.uri)
					    files.push(f.uri);
				});
                
            })
        })
        return files;
    }

    updateFileUri(oldUri,newUri){
        this.state.rooms.forEach(room => {
            Object.keys(room.files).forEach(cat => {
                category = room.files[cat];
                category.forEach( file => {
                    if(file.uri == oldUri){
                        file.process = false;
                        file.uri = newUri;
                    }
                })
            })
        })
    }

    async getUpdatedRooms(){
        const uploadFiles = this.getFilesForUpload();
        const total = uploadFiles.length;
        let qty = 1;
        if(total == 0) return this.state.rooms;
        return await new Promise((resolve) => {
            uploadFiles.forEach(async (file,i) => {
                this.context.message(I18n.t('room.uploading',{total,qty}),0);
                const uri = await UserService.uploadImageAsync(file);
                this.updateFileUri(file,uri);
                qty++;
                if(i == total - 1)
                    resolve()
            })
        })
    }

    handleFormSubmit(){
        const { projectType, clientSelected, projectName, summary, startDate, endDate, loading } = this.state;
        if(projectType != null && clientSelected != null && projectName != ''&& 
            summary != '' && startDate != '' && endDate != ''){
            if(loading) return;
            else {
                this.setState({
                    loading: true
                }, async () => {
                    const myId = this.context.user.magento.id;
                    const customerEmail = clientSelected.email;
                    await this.getUpdatedRooms();
                    this.context.message('salvando...',2000);
                    updatedRooms = this.state.rooms;
                    const project = {
                        type: projectType.name,
                        name: projectName,
                        summary: summary,
                        startDate: startDate,
                        endDate: endDate,
                        rooms: updatedRooms
                    }
                    UserService.createOrUpdateProject(myId,customerEmail,project,this.state.id).then(() => {
                        this.context.message(`Projeto ${this.isEditing() ? 'atualizado' : 'cadastrado'} com sucesso!`);
                        this.setState({
                            loading: false
                        },() => {
                            Actions.reset('_projects');
                        })
                    }).catch(e => {
                        this.context.message('Erro ao cadastrar projeto. Tente novamente');
                        this.setState({
                            loading: false
                        })
                    })
                })
            }
        } else {
            this.context.message(I18n.t('verifique os campos antes de continuar'));
        }
    }

    renderRoomModal(){
        return(
            <Modal
                animationType={'slide'}
                onRequestClose={() => {}}
                visible={this.state.roomModal}
            >

            </Modal>
        )
    }

    renderRoomListItem({item, index}){
        return(
            <ListItem 
                title={item.room.label}
                titleStyle={{
                    fontFamily: 'system-medium',
                    color: 'rgb(77,77,77)',
                    fontSize: 14
                }}
                chevron={{
                    color: 'rgb(201,2,7)',
                    type: 'entypo',
                    name: 'chevron-right',
                    size: 20
                }}
                containerStyle={{
                    borderRadius: 5,
                    marginVertical: 5
                }}
                onPress={() => {
                    this.toggleRoomModal(index)
                }}
            />
        )
    }

    renderRooms(){
        if(this.state.rooms.length == 0) return <></>
        return(
            <FlatList 
                data={this.state.rooms}
                renderItem={this.renderRoomListItem.bind(this)}
                keyExtractor={(i,k) => k.toString()}
            />
        )
    }

    renderForm(){
        return(
            <ScrollView style={projectStyle.formView}>
                <View style={accountStyle.formRow}>
                    <Input 
                        label={I18n.t('project.projectName')}
                        value={this.state.projectName}
                        onChangeText={this.handleProjectNameChange.bind(this)}
                    />
                </View>
                <View style={[accountStyle.formRow,{marginHorizontal: 10}]}>
                    <TextArea 
                        label={I18n.t('project.summary')}
                        underlineColorAndroid={'transparent'}
                        value={this.state.summary}
                        onChangeText={this.handleSummaryChange.bind(this)}
                    />
                </View>
                <View style={accountStyle.formRow}>
                    <View style={accountStyle.maskedInputArea}>
                        <View style={projectStyle.clientLabelArea}>
                            <Text style={mainStyle.inputLabel}>{I18n.t('project.client')}</Text>
                            {!this.isEditing() &&
                                <View style={[projectStyle.addClientArea]}>
                                    <TouchableOpacity onPress={() => { Actions.push('_addClient', {popTo: Actions.currentScene}) }} style={projectStyle.addClientClickArea}>
                                        <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                        <Text style={projectStyle.addClientText}>{' '}{I18n.t('newProject.newClient')}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <Select 
                            options={this.getClients()}
                            onOptionSelected={this.handleClientSelect.bind(this)}
                            arrowColor={'rgb(226,0,6)'}
                            initial={this.state.clientSelected}
                            fullWidth
                            disabled={this.isEditing()}
                        />
                    </View>
                </View>
                <View style={accountStyle.formRow}>
                    <DatePicker 
                        label={I18n.t('project.startDate')}
                        type={'datetime'}
                        options={{
                            format: 'DD/MM/YYYY'
                        }}
                        value={this.state.startDate}
                        onChangeText={this.handleStartDateChange.bind(this)}
                    />
                    <DatePicker 
                        label={I18n.t('project.endDate')}
                        numberOfLines={1}
                        type={'datetime'}
                        options={{
                            format: 'DD/MM/YYYY'
                        }}
                        value={this.state.endDate}
                        onChangeText={this.handleEndDateChange.bind(this)}
                    />
                </View>
                <View style={accountStyle.formRow}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        paddingHorizontal: 10
                    }}>
                        <Text style={{flex:1}} weight={'bold'}>{I18n.t('project.rooms')}</Text>
                        <View style={{
                            flex:1,
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}>
                            <Select
                                options={this.state.projectType.rooms}
                                onOptionSelected={this.handleSelectRoom.bind(this)}
                            >
                                <GradientButton
                                    vertical
                                    colors={['rgb(170,4,8)','rgb(226,0,6)']}
                                    width={32}
                                    height={32}
                                    title={<AntDesign size={18} name={'plus'} />}
                                    titleStyle={drawerStyle.editText}
                                />
                            </Select>
                        </View>
                    </View>
                </View>
                <View>
                    {this.renderRooms()}
                </View>
                <View style={{marginVertical: 20}}>
                    <Button 
                        title={I18n.t('project.save')}
                        containerStyle={accountStyle.accountTypeButtonContainer}
                        buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.projectSaveButton]}
                        titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                        onPress={this.handleFormSubmit.bind(this)}
                        loading={this.state.loading}
                    />
                </View>
            </ScrollView>
        )
    }

    renderCenter(){
        if(this.state.roomModal){
            const currentRoom = this.state.currentRoom != -1 ? this.state.rooms[this.state.currentRoom] : null;
            return(
                <Room 
                    onBack={this.toggleRoomModal.bind(this)}
                    room={this.state.room}
                    onSave={this.handleRoomSave.bind(this)}
                    roomState={currentRoom}
                />
            )
        }
        return(
            <View style={{flex:1}}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    title={ I18n.t( this.isEditing() ? 'section.editProject' : 'section.addProject')}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={'rgb(103,4,28)'}
                />
                <View style={projectStyle.projectTypeArea}>
                    <Text weight={'bold'}>{I18n.t('project.projectType')}</Text>
                    <Select 
                        options={this.projects}
                        onOptionSelected={this.handleTypeSelect.bind(this)}
                        arrowColor={'rgb(226,0,6)'}
                        initial={this.state.projectType}
                    />
                </View>
                {this.state.projectType != null &&
                    <View style={{flex:1}}>
                        {this.renderForm()}
                    </View>
                }
                <KeyboardSpacer />
            </View>
        )
    }
}