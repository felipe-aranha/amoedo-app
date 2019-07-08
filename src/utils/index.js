import variables from '../../assets/variables';
import I18n from '../i18n';
export default variables;

export { UploadMedia } from './UploadMedia';

export const isEmailValid = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const parseName = (name) => {
	fullName = name.split(" ");
	firstname = fullName[0];
	fullName.shift();
	lastname = fullName.length > 0 ? fullName.join(" ") : "";
	return { firstname, lastname };
}

export const getProjectTypes = () => {
	const { project } = variables.app;
	return project.projectType.map(p => {
		const rooms = project.rooms[p.rooms].map( room => {
			return {
				name: room,
				label: I18n.t(`project.room.${room}`)
			}
		})
		return {
			name: p.name,
			rooms: rooms,
			label: I18n.t(`project.type.${p.name}`)
		}
	})
}

export const parseDate = (d) => {
	o = ~d.indexOf("-") ? "-" : "/";
	n = ~d.indexOf("-") ? "/" : "-";
	a = d.split(o);
	if(a.length != 3) return false;
	nd = `${a[2]}${n}${a[1]}${n}${a[0]}`;
	return nd
}

export const isCpfValid = (cpf) => {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}