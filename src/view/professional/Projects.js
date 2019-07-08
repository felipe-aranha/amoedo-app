import React from 'react';
import { Image } from 'react-native';
import Professional from '../Professional';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';
import { UserService } from '../../service/firebase/UserService';
import { MainContext } from '../../reducer';
import { AppListItem } from '../../components';
import { secondaryColor } from '../../style';

export default class Projects extends Professional{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            items: [],
            loading: true 
        }
    }

    title = I18n.t('section.projects');
    icon = require('../../../assets/images/icons/project-add-x2.png');
    showFloatingButton = true;
    floatingButtonTitle = I18n.t('floatButton.newProject');

    renderItem({item}){
        leftIcon = <Image style={{width:50,height:50}} source={require('../../../assets/images/icons/list-project-x2.png')} />
        return <AppListItem 
            leftIcon={leftIcon}
            title={item.data.name}
            chevronColor={secondaryColor}
            icon1={'calendar'}
            icon2={'check-warning'}
            subtitle1={I18n.t('list.project.startedAt',{date:item.data.startDate})}
            subtitle2={I18n.t('list.project.inProgress')}
            onPress={() => {
                Actions.reset('_addProject', { project: item })
            }}
        />
    }

    componentDidMount(){
        const myId = this.context.user.magento.id;
        const myProjects = UserService.getProjects(myId);
        myProjects.onSnapshot(doc => {
            this.setState({
                loading: false
            })
            if(doc.empty){
                this.setState({items: []})
            }
            else {
                items = doc.docs.map(d => {
                    return {
                        ...d.data(),
                        id: d.id
                    }
                });
                this.setState({items})
            }
        })
    }

    onFloatButtonPress(){
        if(Actions.currentScene == '_projects')
            Actions.reset('_addProject');
    }

    renderEmptyList(){
        image = require('../../../assets/images/icons/x-x2.png');
        title = I18n.t('empty.projects.title');
        subtitle = I18n.t('empty.projects.subtitle');
        return super.renderEmptyList(image,title,subtitle);
    }
}