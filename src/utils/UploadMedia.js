import { ImagePicker, Permissions } from 'expo';

export class UploadMedia{

    static async getPermissionAsync(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL,Permissions.CAMERA);
        return status == 'granted'
    }

    static async getFileAsync(){
        const allowed = await UploadMedia.getPermissionAsync();
        if(!allowed) return false;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            base64: true
        })
        if(result.cancelled) return false;
        else return result.base64 || result.uri;
    }

    static async takePhotoAsync(){
        const allowed = await UploadMedia.getPermissionAsync();
        if(!allowed) return false;
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            base64: true
        })
        if(result.cancelled) return false;
        else return result.base64 || result.uri;
    }

}