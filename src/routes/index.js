import React from 'react';
import {
    Router, 
    Scene, 
    Drawer, 
    Modal,
    Tabs
} from 'react-native-router-flux';
import { View, StyleSheet } from 'react-native';
import { 
    Wizard,
    AccountType
} from '../view';
import Toast from 'react-native-easy-toast';

export class Routes extends React.Component{

    constructor(props,state){
        super(props,state);
        this._toast = React.createRef();
    }

    message(message, time = DURATION, callback){
		if(this._toast != null)
			this._toast.show(message,time, () => {
				if(callback) callback
			});
	}

    removeMessage(){
		this._toast.close(1);
	}

    render(){
        return(
            <View style={StyleSheet.absoluteFill}>
                <Router>
                    <Modal key='main'>
                        <Scene hideNavBar key='intial' component={AccountType} />
                    </Modal>
                </Router>   
                <Toast position={'center'} ref={this.toast} />
            </View>         
        );
    }
}