import React from 'react';
import CustomerProjects from "../customer/CustomerProjects";
import { primaryColor, tertiaryColor } from '../../style';
import I18n from '../../i18n';
import { UserService } from '../../service/firebase/UserService';
import { MainContext } from '../../reducer';
import { View } from 'react-native';
import { Image } from 'react-native-elements';
import { ImageBase64, Text } from '../../components';

export default class ClientProjects extends CustomerProjects{

    static contextType = MainContext;

    barStyle = 'dark-content';
    barColor= primaryColor;
    titleStyle = {
        color: 'rgb(57,57,57)'
    }
    title = I18n.t('section.client');
    sectionColor = tertiaryColor;
    isProfessional = true;

    renderSearch(){
        const { client }  = this.props;
        avatarImage = client.avatar != null && client.avatar.trim() != '' ? 
                    <ImageBase64 avatar style={{width:50,height:50}}  data={client.avatar} /> :
                    <Image style={{width:50,height:50}} source={require('../../../assets/images/icons/list-user-x2.png')} />
        return(
            <>
                <View style={{
                    paddingHorizontal: 30, 
                    paddingVertical: 10, 
                    backgroundColor: '#fff', 
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {avatarImage}
                    <View style={{ marginLeft: 20 }}>
                        <Text size={14} weight={'bold'}>{client.name}</Text>
                        <Text size={14}>{client.email}</Text>
                    </View>
                </View>
            </>
        )

    }

    componentDidMount(){
        super.componentDidMount();
        const myId = this.context.user.magento.id;
        const clientId = this.props.client.email;
        const myProjects = UserService.getMutualProjects(myId, clientId);
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

}