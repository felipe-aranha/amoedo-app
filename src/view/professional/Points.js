import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { secondaryColor } from '../../style';
import { View } from 'react-native';
import { Text } from '../../components';
import { MainContext } from '../../reducer';
import { UserService } from '../../service/firebase/UserService';
import { ListItem } from 'react-native-elements';
import { moment } from '../../utils';

export default class Points extends Professional{

    static contextType = MainContext;

    title = I18n.t('section.points');
    listStyle = { margin: 20 }

    constructor(props,context){
        super(props,context);
        this.state = {
            points: '-',
            items: []
        }
    }

    componentDidMount(){
        super.componentDidMount();
        this.subscription = this.getProfessionalDoc().onSnapshot(doc => {
            const { points, transactions } = doc.data();
            this.setState({
                points, 
                items: transactions
            })

        })
    }

    getProfessionalDoc(){
        return UserService.getProfessionalDoc(this.context.user.magento.id.toString());
    }

    renderItem({item}){
        const points = `${item.points >= 0 ? '+' : '-' } ${Math.abs(Number(item.points).toFixed(2) || 0)}`;
        const textColor = item.points >= 0 ? 'rgb(61,123,186)' : 'rgb(226,0,6)';
        const formatedDate = moment(item.createdAt,'YYYY-MM-DD HH:mm:ss').format('DD/MMM');
        return(
            <ListItem 
                containerStyle={{ marginTop: 5 }}
                leftElement={(
                    <Text size={12} weight={'medium'}>{formatedDate}</Text>
                )}
                title={(
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{textAlign:'center'}} numberOfLines={1} size={12} weight={'medium'}>{item.customer_name}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{textAlign:'right'}} numberOfLines={1} size={12} weight={'medium'}>{I18n.t(`points.${item.points >= 0 ? 'credited' : 'debited'}`)}</Text>
                        </View>
                    </View>
                )}
                rightElement={(
                    <View>
                        <Text weight={'bold'} color={textColor}>{points}</Text>
                        <Text weight={'medium'} color={textColor} style={{textAlign:'right'}}>{I18n.t('points.points')}</Text>
                    </View>
                )}
            />
        )
    }

    renderSearch(){
        const { points } = this.state;
        const pointsText = Number.isInteger(points) ? Number(points) : Number(points).toFixed(2);
        return(
            <View style={{
                backgroundColor: 'rgb(103,4,28)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20
            }}>
                <Text weight={'medium'} color={'#fff'} size={40}>{points == '-' ? points : pointsText}</Text>
                <Text weight={'medium'} color={'rgb(226,0,6)'} size={12}>{I18n.t('points.balance')}</Text>
            </View>
        )
    }

}