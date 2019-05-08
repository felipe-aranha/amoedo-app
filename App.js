import React from 'react';

import { Routes } from './src/routes';
import { AppLoading, Font } from 'expo';

export default class App extends React.Component {

	constructor(props,state){
		super(props,state);
		this.state = {
			isReady: false
		}
	}


	_init(){
		p1 = Font.loadAsync({
			'system-semibold': require('./assets/fonts/system-semibold.ttf'),
			'system': require('./assets/fonts/system-regular.ttf'),
			'system-bold': require('./assets/fonts/system-bold.ttf'),
		});
		return Promise.all();
	}

	_finish(){
		this.setState({
			isReady: true
		})
	}

	_error(){

	}

	render() {
		return this.state.isReady ? 
				<Routes />
			:
				<AppLoading 
					startAsync={this._init.bind(this)}
					onFinish={this._finish.bind(this)}
					onError={this._error.bind(this)}
				/>
	}
}