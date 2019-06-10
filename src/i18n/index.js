import I18n from 'i18n-js';
import { default as pt } from '../../assets/i18n/pt';


I18n.fallbacks = true;
I18n.translations = { pt };
 
I18n.defaultLocale = "pt";
I18n.locale = "pt";
I18n.currentLocale();

export default I18n;