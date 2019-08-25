import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { secondaryColor } from '../../style';
import { View } from 'react-native';
import { Text } from '../../components';
import { MainContext } from '../../reducer';
import { UserService } from '../../service/firebase/UserService';
import { ListItem } from 'react-native-elements';

export default class Points extends Professional{

    static contextType = MainContext;

    title = I18n.t('section.points');
    listStyle = { margin: 20 }

    constructor(props,context){
        super(props,context);
        this.state = {
            points: '-',
            items: [
                { date: '15/jun', client: 'Claudia Ferreira', amount: 100 },
                { date: '13/jun', client: 'Rodrigo Ferreira', amount: -100 }
            ]
        }
    }

    componentDidMount(){
        this.subscription = this.getProfessionalDoc().onSnapshot(doc => {
            const { points, transactions } = doc.data();
            this.setState({
                points, 
                // items: transactions
            })

        })
    }

    getProfessionalDoc(){
        return UserService.getProfessionalDoc(this.context.user.magento.id.toString());
    }

    renderItem({item}){
        const points = `${item.amount >= 0 ? '+' : '-' } ${Math.abs(item.amount)}`;
        const textColor = item.amount >= 0 ? 'rgb(61,123,186)' : 'rgb(226,0,6)';
        return(
            <ListItem 
                containerStyle={{ marginTop: 5 }}
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
        return(
            <View style={{
                backgroundColor: 'rgb(103,4,28)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20
            }}>
                <Text weight={'medium'} color={'#fff'} size={40}>{points}</Text>
                <Text weight={'medium'} color={'rgb(226,0,6)'} size={12}>{I18n.t('points.balance')}</Text>
            </View>
        )
    }

}