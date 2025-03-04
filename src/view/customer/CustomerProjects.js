import React from 'react';
import Customer from '../Customer';
import I18n from '../../i18n';
import { UserService } from '../../service/firebase/UserService';
import { Image, ButtonGroup } from 'react-native-elements';
import { AppListItem } from '../../components';
import { tertiaryColor, secondaryColor } from '../../style';
import { Actions } from 'react-native-router-flux';
import { View, FlatList } from 'react-native';
import { getProjectStatuses } from '../../utils';

export default class CustomerProjects extends Customer {

    updateFilesIndex(fileIndex){
        this.setState({fileIndex})
    }
    statuses = getProjectStatuses();
    title = I18n.t('section.projects');
    icon = require('../../../assets/images/icons/project-add-x2.png');
    showFloatingButton = false;
    sectionColor = secondaryColor;
    isProfessional = false;

    componentDidMount(){
        super.componentDidMount();
        if(this.context.openDrawer){
            this.context.openDrawer = false;
            Actions.drawerOpen();
        }
        const myId = this.context.user.magento.email;
        const myProjects = UserService.getCustomerProjects(myId);
        this.subscription = myProjects.onSnapshot(doc => {
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

    renderItem({item}){
        leftIcon = <Image style={{width:50,height:50}} source={require('../../../assets/images/icons/list-project-x2.png')} />
        if(this.getFileIndex() == 1){
            return(
                <>
                   {item.data.rooms.map((room,i) => {
                       const status = room.status || 'available';
                       return(
                           <AppListItem 
                                leftIcon={leftIcon}
                                key={`${item.id}${i}`}     
                                title={room.name || `${room.room.label} - ${item.data.name}`}
                                chevronColor={tertiaryColor}
                                hideChevron={this.isProfessional}
                                icon1={'check-warning'}
                                subtitle1={I18n.t(`list.quote.${status}`)}
                                onPress={() => {
                                    if(status != 'available'){
                                        this.context.message(I18n.t('checkout.error.quoteNotAvailable'))
                                        return;
                                    }
                                    Actions.push('cart',{project: item, room})
                                }}
                           />
                       )
                   })} 
                </>
            )
        }
        return <AppListItem 
            leftIcon={leftIcon}
            title={item.data.name}
            chevronColor={tertiaryColor}
            icon1={'calendar'}
            icon2={'check-warning'}
            subtitle1={I18n.t('list.project.startedAt',{date:item.data.startDate})}
            subtitle2={I18n.t(`project.statuses.${item.status || this.statuses[0]}`)}
            onPress={() => {
                Actions.push(this.isProfessional ? 'addProject' : 'project', { project: item })
            }}
        />
    }

    renderEmptyList(){
        image = require('../../../assets/images/icons/x-x2.png');
        title = I18n.t('empty.projects.title');
        subtitle = '';
        return super.renderEmptyList(image,title,subtitle);
    }

    getFileIndex(){
        const { fileIndex } = this.state;
        const f =  typeof(fileIndex) !== 'undefined' ? fileIndex : this.props.index || 0;
        return f;
    }

    renderSearch(){
        return(
            <View style={{marginHorizontal:40, marginTop: 20}}>
                <ButtonGroup 
                    onPress={this.updateFilesIndex.bind(this)}
                    selectedIndex={this.getFileIndex()}
                    buttons={[I18n.t('project.projects'),I18n.t('project.quotes')]}
                    containerStyle={{
                        borderRadius: 10
                    }}
                    selectedButtonStyle={{
                        backgroundColor: this.sectionColor
                    }}
                    selectedTextStyle={{
                        color: '#fff',
                        fontSize: 12,
                        fontFamily: 'system-medium'
                    }}
                    textStyle={{
                        color: this.sectionColor,
                        fontSize: 12,
                        fontFamily: 'system-medium'
                    }}
                />
            </View>
        );
    }

    renderContent(){
        return(
            <>
            {this.renderSearch()}
            <View style={{flex:1,margin:20}}>
                    {this.state.items.length > 0 || this.state.loading ? 
                     <View style={{flex:1}}>
                        <FlatList 
                            key={this.getFileIndex()}
                            data={this.state.items}
                            renderItem={this.renderItem.bind(this)}
                            keyStractor={this.keyStractor}
                            refreshing={this.state.loading}
                        />
                    </View> :
                    this.renderEmptyList()
                    }
                
            </View>
            </>
        )
    }

}
