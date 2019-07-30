import React from 'react';
import Customer from '../Customer';
import I18n from '../../i18n';

export default class CustomerProjects extends Customer {
    title = I18n.t('section.projects');
    icon = require('../../../assets/images/icons/project-add-x2.png');
    showFloatingButton = false;

    renderEmptyList(){
        image = require('../../../assets/images/icons/x-x2.png');
        title = I18n.t('empty.projects.title');
        subtitle = I18n.t('empty.projects.subtitle');
        return super.renderEmptyList(image,title,subtitle);
    }

}
