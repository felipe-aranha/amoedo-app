import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';

export class Documents extends MainView {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
    }

    renderCenter(){
        return <></>
    }
}