import React from 'react';
import Professional from '../Professional';
import { tertiaryColor, accountStyle, projectStyle, secondaryColor } from '../../style';
import { getProjectLogs } from '../../utils';
import I18n from '../../i18n';
import { View, ScrollView, Image } from 'react-native';
import { MaskedInput, Text, Select, TextArea, KeyboardSpacer, MediaSelect, ImageModal } from '../../components';
import { Button, ListItem, CheckBox } from 'react-native-elements';
import { MainContext } from '../../reducer';
import { UserService } from '../../service/firebase/UserService';
import MainStyle from '../../style/MainStyle';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { CustomerService } from '../../service/CustomerService';

export default class ProjectLog extends Professional{

    static contextType = MainContext;

    leftIconColor = tertiaryColor;
    logs = getProjectLogs();
    

    constructor(props, context){
        super(props,context);
        const log = props.log || {};
        this.readOnly = log.id ? true : false;
        this.title = this.readOnly ? I18n.t('section.logs') : I18n.t('section.newLog');
        this.dobRef = React.createRef();
        const now = new Date();
        const month = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`;
        const date = log.date || `${now.getDate()}/${month}/${now.getFullYear()}`;
        this.state = {
            items: [],
            id: log.id || {},
            date,
            type: typeof(log.type) !== 'undefined' ? log.type :typeof(props.type) !== 'undefined' ?  props.type : null,
            description: log.description || '',
            approved: log.approved,
            images: log.images || [],
            projectId: props.projectId || null,
            dobValid: true,
            loadingUsers: false,
            loadingProjects: false,
            activeUser: null,
            activeProject: null,
            users: [],
            projects: [],
            loading: false
        }
        this.customerService = new CustomerService();
    }

    componentDidMount(){
        if(this.state.projectId != null) return;
        if(this.isProfessional()){
            this.setState({
                users: this.context.user.clients
            })
        } else {
            this.getProfessionals();
        }
    }

    getProjects(){
        const { loadingProjects, activeUser } = this.state;
        if(loadingProjects || activeUser == null || !activeUser.value) return;
        this.setState({
            loadingProjects: true
        })
        const professional = this.isProfessional() ? this.context.user.magento.id : this.state.activeUser.value.id;
        const client = this.isProfessional() ?  activeUser.value.email : this.context.user.magento.email;
        const myProjects = UserService.getMutualProjects(professional, client);
        myProjects.get().then(doc => {
            this.setState({
                loadingProjects: false
            })
            if(doc.empty){
                this.setState({projects: []})
            }
            else {
                projects = doc.docs.map(d => {
                    return {
                        ...d.data(),
                        id: d.id
                    }
                });
                this.setState({projects})
            }
        })
    }

    async getProfessionals(){
        if(this.context.user.myProfessionals){
            this.setState({
                users: this.context.user.myProfessionals
            })
            return;
        }      
        this.setState({
            loadingUsers: true
        })      
        const myId = this.context.user.magento.email;
        const professionals = await UserService.getCustomerProfessionals(myId).then(async response => {
            let pp = [];
            return await Promise.all(response.map(async(p, i) => {
                    if(pp.includes(p.id)) return undefined;
                    pp.push(p.id);
                    const customer = await this.customerService.getCustomer(p.id)
                    return {
                        ...p,
                        name: `${customer.firstname} ${customer.lastname}`
                    }
                })
            )
        });
        const myProfessionals = []
        professionals.forEach(p => {
            if(p)   
                myProfessionals.push(p);
        });
        this.context.user.myProfessionals = myProfessionals;
        this.setState({
            users: myProfessionals,
            loadingUsers: false
        })
    }

    handleActiveUser(activeUser){ 
        if(!_.isEqual(activeUser, this.state.activeUser))       
            this.setState({ activeUser, activeProject: null }, this.getProjects.bind(this))
    }

    handleActiveProject(activeProject){
        this.setState({ activeProject })
    }

    handleActiveType(type){
        if(this.state.type != type.value)
            this.setState({ 
                type: type.value,
                images: [],
                approved: null
            })
    }

    handleDateChange(date){
        if(!this.readOnly)
            this.setState({ date })
    }

    handleTypeChange(type){
        if(!this.readOnly)
            this.setState({ type })
    }

    handleDescriptionChange(description){
        if(!this.readOnly)
            this.setState({ description })
    }

    handleApprovedeChange(approved){
        if(!this.readOnly)
            this.setState({ approved })
    }

    handleSelectMedia(media){
        if(media.cancelled) return;
        const images = this.state.images.slice();
        images.push(media.uri);
        this.setState({
            images
        })
    }

    getLogTitle(i=-1){
        i = i > -1 ? i : this.state.activeLog;
        return I18n.t(`project.logs.${this.logs[i]}`);
    }

    renderLeftIcon(){
        return undefined;
    }

    renderSearch(){
        return <></>;
    }

    renderEmptyList(){
        return <></>;
    }

    valiDate(e){
        const dobValid = this.dobRef.current.isValid();
        this.setState({
            dobValid
        })
    }

    handleFormSubmit(){
        const { dobValid, activeProject, approved, date, type, images, description, loading } = this.state;
        if(loading) return;
        if(!dobValid){
            return;
        }
        if((activeProject == null || !activeProject.value) && !this.props.projectId){
            return;
        }
        if(description.trim().length == 0){
            return;
        }
        if(type == 2 && approved == null){
            return;
        }
        const log = {
            type,
            typeName: this.logs[type],
            date,
            approved: typeof(approved) !== 'undefined' ? approved : null,
            images,
            description,
            createdBy: this.isProfessional() ? 'professional' : 'client',
            createdAt: new Date()
        }
        this.openModalLoading();
        this.setState({ loading: true })
        UserService.addProjectLog(this.props.projectId || activeProject.value.id, log).then(() => {
            this.closeModalLoading();
            this.setState({ loading: false })
            Actions.pop();
        }).catch(e => {
            console.log(e);
            this.setState({ loading: false })
            this.closeModalLoading();
        })
    }

    getUserOptions(){
        return this.state.users.map( user => {
            return {
                label: user.name ? user.name : `${user.firstname} ${user.lastname}`,
                value: user
            }
        })
    }

    getTypeOptions(){
        return Object.keys(this.logs).map( log => {
            return {
                label: this.getLogTitle(log),
                value: log
            }
        })
    }

    getProjectOptions(){
        return this.state.projects.map( project => {
            return {
                label: project.data.name,
                value: project
            }
        })
    }

    renderContent(){
        const { activeUser, projectId, type, activeProject, images } = this.state;
        const { user, log } = this.props;
        const activeUserName = activeUser != null ? activeUser.label : user ? user : I18n.t('log.form.select');
        const activeProjectName =  activeProject != null ? activeProject.label : log && log.project && log.project.data && log.project.data.name ? log.project.data.name : I18n.t('log.form.select');
        const activeTypeName = type != null ? this.getLogTitle(type) : I18n.t('log.form.select');
        return(
            <View style={{flex:1}}>
                <ScrollView 
                    style={{padding: 20}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {!this.readOnly &&  <Text weight={'bold'} size={14} style={{marginBottom: 10}}>{I18n.t('log.title')}</Text> }
                    <View style={accountStyle.logFormRow}>
                        <View style={{flex:1}}>
                            <MaskedInput 
                                label={I18n.t('log.form.date')}
                                value={this.state.date}
                                onChangeText={this.handleDateChange.bind(this)}
                                keyboardType={'number-pad'}
                                onEndEditing={this.valiDate.bind(this)}
                                maxLength={10}
                                type={'datetime'}
                                options={{
                                    format: 'DD/MM/YYYY'
                                }}
                                inputRef={this.dobRef}
                                errorMessage={this.state.dobValid === false ? I18n.t('account.errorMessage.dob') : ''}
                            />
                        </View>
                        <View style={{flex:1}} />
                    </View>
                    {projectId == null && <>
                    <View style={accountStyle.logFormRow}>
                        <View style={accountStyle.logInputArea}>
                            <Text numberOfLines={1} style={MainStyle.inputLabel}>{I18n.t(`log.form.${this.isProfessional() ? 'client' : 'professional'}`)}</Text>
                            <Select
                                options={this.getUserOptions()}
                                onOptionSelected={this.handleActiveUser.bind(this)}
                                disabled={this.readOnly}
                            >
                                <View style={{flex:1}}>
                                    <DropDown 
                                        name={activeUserName}
                                    />
                                </View>
                            </Select>
                        </View>
                    </View>
                    <View style={accountStyle.logFormRow}>
                        <View style={accountStyle.logInputArea}>
                            <Text numberOfLines={1} style={MainStyle.inputLabel}>{I18n.t(`log.form.project`)}</Text>
                            <Select
                                options={this.getProjectOptions()}
                                onOptionSelected={this.handleActiveProject.bind(this)}
                                disabled={this.readOnly}
                            >
                                <View style={{flex:1}}>
                                    <DropDown 
                                        name={activeProjectName}
                                    />
                                </View>
                            </Select>
                        </View>
                    </View>
                    </>}
                    <View style={accountStyle.logFormRow}>
                        <View style={accountStyle.logInputArea}>
                            <Text numberOfLines={1} style={MainStyle.inputLabel}>{I18n.t(`log.form.type`)}</Text>
                            <Select
                                options={this.getTypeOptions()}
                                onOptionSelected={this.handleActiveType.bind(this)}
                                disabled={this.readOnly}
                            >
                                <View style={{flex:1}}>
                                    <DropDown 
                                        name={activeTypeName}
                                    />
                                </View>
                            </Select>
                        </View>
                    </View>
                    <View style={[accountStyle.logFormRow, { marginHorizontal: 10 }]}>
                        <TextArea 
                            label={I18n.t('log.form.description')}
                            underlineColorAndroid={'transparent'}
                            value={this.state.description}
                            onChangeText={this.handleDescriptionChange.bind(this)}
                        />
                    </View>
                    <View style={accountStyle.logFormRow}>
                    {type == 0 &&
                        <View style={accountStyle.logInputArea}>
                            <Text numberOfLines={1} style={MainStyle.inputLabel}>{I18n.t(`log.form.images`)}</Text>
                            {!this.readOnly &&
                                <MediaSelect
                                    onMediaSelected={this.handleSelectMedia.bind(this)}
                                    denyEdit
                                    style={{alignItems: 'flex-start'}}
                                >
                                    <View style={{ marginTop: 10, padding: 10, borderRadius: 5, backgroundColor: 'rgb(255,0,0)' }}>
                                        <Text color={'#fff'} weight={'medium'} size={12} >{I18n.t('log.form.upload')}</Text>
                                    </View>
                                </MediaSelect>
                            }
                        </View>
                    }
                    {type == 2 &&
                        <View style={accountStyle.logInputArea}>
                            <Text numberOfLines={1} style={MainStyle.inputLabel}>{I18n.t(`log.form.approvation`)}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox
                                    title={I18n.t(`log.form.yes`)}
                                    textStyle={{
                                        fontFamily: 'system-medium',
                                        color: 'rgb(77,77,77)'
                                    }}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checkedColor={secondaryColor}
                                    uncheckedColor={'rgb(77,77,77)'}
                                    checked={this.state.approved == true}
                                    onPress={() => { if(!this.readOnly) this.setState({ approved: true })}}
                                    containerStyle={{
                                        backgroundColor: 'transparent',
                                        marginLeft: 0,
                                        marginRight: 0,
                                        padding: 0
                                    }}
                                /> 
                                <CheckBox
                                    title={I18n.t(`log.form.no`)}
                                    textStyle={{
                                        fontFamily: 'system-medium',
                                        color: 'rgb(77,77,77)'
                                    }}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checkedColor={secondaryColor}
                                    uncheckedColor={'rgb(77,77,77)'}
                                    checked={this.state.approved == false}
                                    onPress={() => { if(!this.readOnly) this.setState({ approved: false })}}
                                    containerStyle={{
                                        backgroundColor: 'transparent',
                                        marginLeft: 0,
                                        marginRight: 0,
                                        padding: 0
                                    }}
                                /> 
                            </View>
                        </View>
                    }
                    </View>
                    <View
                        style={{
                            marginVertical: 10,
                        }}
                    >
                        <ImageModal 
                            key={images.length}
                            dataSource={images.map(image => {
                                return {
                                    url: image
                                }
                            })}
                            position={this.state.slidePosition}
                            onPositionChanged={position => {
                                this.setState({ slidePosition: position })
                            }}
                        />
                    </View>
                    {!this.readOnly ?
                        <View style={{marginTop: 20,marginBottom:50, marginHorizontal: 20}}>
                            
                            <Button 
                                title={I18n.t('log.form.save')}
                                containerStyle={accountStyle.accountTypeButtonContainer}
                                buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.projectSaveButton]}
                                titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                                onPress={this.handleFormSubmit.bind(this)}
                                loading={this.state.loading}
                            />
                            
                        </View>
                        :
                        <View style={{marginBottom:30}}></View>
                    }
                </ScrollView>
                <KeyboardSpacer />
            </View>
        )
    }

}

const DropDown = (props) => {
    return (
        <ListItem 
            title={props.name}
            titleStyle={{
                fontFamily: 'system-medium',
                color: 'rgb(77,77,77)',
                fontSize: 14
            }}
            titleProps={{
                numberOfLines: 1
            }}
            chevron={{
                color: 'rgb(77,77,77)',
                type: 'entypo',
                name: 'chevron-down',
                size: 20
            }}
            containerStyle={{
                borderRadius: 5,
                flex: 1,
                padding: 10
            }}
        />
    )
}