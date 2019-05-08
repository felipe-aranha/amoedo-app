import I18n from 'react-native-i18n';
import { pt } from '../../assets/i18n/pt';

I18n.fallbacks = true;
I18n.translations = { pt };
 
I18n.defaultLocale = "pt-BR";
I18n.locale = "pt-BR";
I18n.currentLocale();

export default I18n;