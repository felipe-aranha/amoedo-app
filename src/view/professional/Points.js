import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { secondaryColor, tertiaryColor, accountStyle, projectStyle } from '../../style';
import { View, Alert } from 'react-native';
import { Text } from '../../components';
import { MainContext } from '../../reducer';
import { UserService } from '../../service/firebase/UserService';
import { ListItem, CheckBox, Button } from 'react-native-elements';
import { moment } from '../../utils';
import { CustomerService } from '../../service/';

export default class Points extends Professional{

    static contextType = MainContext;

    title = I18n.t('section.points');
    listStyle = { margin: 20 }

    listColumns = 1;

    constructor(props,context){
        super(props,context);
        this.state = {
            points: '-',
            items: [],
            checked:[]
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

    getCheckedPoints(){
        let total = 0;
        const { checked, items } = this.state;
        checked.forEach( c => {
            const t = items.find( i => i.order == c );
            if(t != null)
                total += t.points
        })
        return Math.abs(Number(total).toFixed(2) || 0);
    }

    redeem(){
        let qty = this.getCheckedPoints();
        Alert.alert(
            I18n.t('points.redeemTitle'), 
            I18n.t('points.redeemDescription', { qty }),
            [
                { style: 'cancel', text: I18n.t('points.cancel') },
                { text: I18n.t('points.confirmRedeem'), onPress: this.proceedRedeem }
            ]
        )
    }

    proceedRedeem = () => {
        const { checked } = this.state;
        const total = this.getCheckedPoints();
        const myId = this.context.user.magento.id
        const service = new CustomerService(this.context.user.token);
        this.openModalLoading();
        const additional = { points: checked, total}
        service.sendEmail(myId, 'pointsredemption', additional).then(r => {
            this.setState({ checked: [] })
        }).catch(() => {
            this.context.message(I18n.t('points.redeemFailed'))
        }).finally(() => {
            this.closeModalLoading()
        })
    }

    toggleCheck = (item) => {
        const debit = item.transactionType == 'debito';
        if(debit)
            return; 
        if(item.status != 'waiting'){
            this.context.message(I18n.t(`points.${item.status}`))
            return;
        }
        let checked = this.state.checked.slice();
        if(checked.find( c => c == item.order) != null){
            checked = checked.filter(c => c != item.order)
        }
        else 
            checked.push(item.order);
        this.setState({ checked })
    }

    _renderItem({item}){
        const { checked } = this.state;
        const points = `${item.points >= 0 ? '+' : '-' } ${Math.abs(Number(item.points).toFixed(2) || 0)}`;
        const textColor = item.points >= 0 ? 'rgb(61,123,186)' : 'rgb(226,0,6)';
        const formatedDate = moment(item.createdAt,'YYYY-MM-DD HH:mm:ss').format('DD/MMM');
        const selectable = item.points > 0 && item.status == 'waiting';
        const isChecked = checked.find( c => c == item.order) != null;
        return(
            <View style={{ flex: 0.5 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', margin: 5, padding: 5,  backgroundColor: '#fff' }}>
                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <CheckBox 
                        onPress={() => { this.toggleCheck(item) }}
                        checked={isChecked || !selectable}
                        checkedIcon={ selectable ? 'check' : 'close' }
                        checkedColor={tertiaryColor}
                        containerStyle={{ padding: 0}}
                    />
                </View>
                <View style={{ flex: 1, opacity: selectable ? 1 : 0.5 }}>
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                        <View style={{flex:1}}>

                            <Text style={{textAlign:'center'}} numberOfLines={1} size={12} weight={'medium'}>{item.customer_name}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{textAlign:'right'}} numberOfLines={1} size={12} weight={'medium'}>{formatedDate}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text weight={'bold'} color={textColor}>{points}</Text>
                        <Text weight={'medium'} color={textColor} style={{textAlign:'right'}}>{I18n.t('points.points')}</Text>
                    </View>
                </View>
            </View>
            </View>
        )
    }

    renderItem({item}){
        const { checked } = this.state;
        const debit = item.transactionType == 'debito'
        const points = `${debit ? '-' : '+' } ${Math.abs(Number(item.points).toFixed(2) || 0)}`;
        const textColor = !debit ? 'rgb(61,123,186)' : 'rgb(226,0,6)';
        const formatedDate = moment(item.createdAt,'YYYY-MM-DD HH:mm:ss').format('DD/MMM');
        const selectable = item.points > 0 && item.status == 'waiting';
        const isChecked = checked.find( c => c == item.order) != null;
        return(
            <ListItem 
                containerStyle={{ marginTop: 5 }}
                leftElement={(
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox 
                                onPress={() => { this.toggleCheck(item) }}
                                checked={isChecked || !selectable}
                                checkedIcon={ selectable ? 'check' : 'close' }
                                checkedColor={debit ? 'transparent' : tertiaryColor}
                                containerStyle={{ padding: 0}}
                            />
                        <Text size={12} weight={'medium'}>{formatedDate}</Text>
                    </View>
                )}
                title={(
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{textAlign:'center'}} numberOfLines={1} size={12} weight={'medium'}>{item.customer_name}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{textAlign:'right'}} numberOfLines={1} size={12} weight={'medium'}>{I18n.t(`points.${!debit ? 'credited' : 'debited'}`)}</Text>
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

    renderListFooter = () => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                <View style={{ flex: 1 }}>
                    <Button 
                        title={I18n.t('points.redeem')}
                        containerStyle={accountStyle.accountTypeButtonContainer}
                        buttonStyle={[accountStyle.accountTypeButton, projectStyle.buttonTertiary]}
                        titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                        onPress={this.redeem.bind(this)}
                        disabled={this.state.checked.length == 0}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    
                </View>
            </View>
        )
    }

}