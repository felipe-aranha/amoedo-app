import React from 'react';
import Register from './Register';
import * as Utils from '../../../utils';

export default class CustomerRegister extends Register {

    handlePersonalDataContinue(state){
        if(this.state.loading) return;
        this.setState({
            personalData: state,
            loading: true
        },() => {
            const { firstname, lastname } = Utils.parseName(state.name);
            data = {
                customer: {
                    email: state.email,
                    firstname,
                    lastname,
                    taxvat: state.cpf
                },
                password: state.password
            } 
            this.customerService.register(data.customer,data.password).then(response => {
                if(response.id){
                    this.setState({
                        userRegistered: true
                    })
                }
            }).catch(e => {
                
            })
        });
    }
}