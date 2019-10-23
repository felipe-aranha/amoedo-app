import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';
import { getProjectLogs } from '../../utils';
import { View } from 'react-native';
import { ButtonGroup, Image } from 'react-native-elements';
import { secondaryColor, tertiaryColor } from '../../style';
import { MainContext } from '../../reducer';
import { UserService } from '../../service/firebase/UserService';
import { CustomerService } from '../../service/CustomerService';
import { AppListItem } from '../../components';

export default class Logs extends Professional{

    static contextType = MainContext;

    title = I18n.t('section.logs');
    icon = require('../../../assets/images/icons/log-add-x2.png');
    showFloatingButton = true;
    floatingButtonTitle = I18n.t('floatButton.newLog');
    logs = getProjectLogs();
    leftIconColor = tertiaryColor;

    constructor(props,context){
        super(props, context);
        this.state = {
            activeLog: props.log || 0,
            items:  [],
            refreshList: 0,
            loading: true,
            myProfessionals: [],
            myClients: this.context.user.clients || [],
        }
        this.subscription = null;
        this.customerService = new CustomerService();
    }

    renderLeftIcon(){
        return this.props.projectId ? undefined : super.renderLeftIcon() ;
    }

    componentDidMount(){
        this.listenToProjects();
        if(!this.isProfessional())
            this.getProfessionals();
    }

    componentWillUnmount(){
        if(this.subscription != null)
        this.subscription();
    }

    listenToProjects(){
        const myId = this.isProfessional() ? this.context.user.magento.id : this.context.user.magento.email;
        const myProjects = this.isProfessional() ? UserService.getProjects(myId) : UserService.getCustomerProjects(myId);
        this.subscription = myProjects.onSnapshot(doc => {
            this.setState({
                loading: false
            })
            if(doc.empty){
                this.setState({items: []})
            }
            else {
                let items = [];
                doc.docs.forEach(d => {
                    const id = d.id;
                    if(this.props.projectId && this.props.projectId != id)
                        return;
                    const logs = d.data().logs || [];
                    if(logs.length > 0){
                        logs.forEach( log => {
                            items.push({
                                ...log,
                                project: d.data()
                            })
                        })
                    }
                });
                this.setState({items})
            }
        })
    }

    onFloatButtonPress(){
        Actions.push('projectLog', { type: this.state.activeLog,  projectId: this.props.projectId });
    }

    getLogTitle(i=-1){
        i = i > -1 ? i : this.state.activeLog;
        return I18n.t(`project.logs.${this.logs[i]}`);
    }

    renderEmptyList(){
        image = require('../../../assets/images/icons/x-x2.png');
        title = I18n.t('empty.log.title', { type: this.getLogTitle().toLowerCase() });
        subtitle = '';
        return super.renderEmptyList(image,title,subtitle);
    }

    async getProfessionals(){
        if(this.context.user.myProfessionals){
            this.setState({
                myProfessionals: this.context.user.myProfessionals
            })
            return;
        }     
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
        const myProfessionals = [];
        professionals.forEach(p => {
            if(p)   
                myProfessionals.push(p);
        });
        this.context.user.myProfessionals = myProfessionals;
        this.setState({
            myProfessionals,
            refreshList: new Date().getTime()
        })
    }

    renderSearch(){
        return(
            <>
            {super.renderSearch()}
            <View style={{marginHorizontal:40, marginTop: 20}}>
                <ButtonGroup 
                    onPress={activeLog => { this.setState({ activeLog, refreshList: activeLog }) }}
                    selectedIndex={this.state.activeLog}
                    buttons={Object.keys(this.logs).map( i => this.getLogTitle(i) )}
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
            </>
        );
    }

    getUserName(item){
        const { myClients, myProfessionals } = this.state;
        let user = '';
        if(this.isProfessional()){
            myClients.forEach( client => {
                if(client.email == item.project.customer){
                    user = client.name;
                }
            })
        } else {
            myProfessionals.forEach( p => {
                if(p.id == item.project.professional){
                    user = p.name;
                }
            })
        }
        return user;
    }

    renderItem({item}){
        const leftIcon = <Image style={{width:50,height:50}} source={require('../../../assets/images/icons/list-log-x2.png')} />
        const user = this.getUserName(item);
        if(item.type != this.state.activeLog) return <></>
        return <AppListItem 
            leftIcon={leftIcon}
            title={item.description}
            chevronColor={secondaryColor}
            icon1={'calendar'}
            icon2={'client'}
            subtitle1={I18n.t('log.registeredIn', { date: item.date })}
            subtitle2={I18n.t(`log.${this.isProfessional() ? 'client' : 'professional' }`, { user })}
            onPress={() => {
                Actions.push('projectLog', { log: item, user })
            }}
        />
    }

}