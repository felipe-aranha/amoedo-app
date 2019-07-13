import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export class UploadMedia{

    static async getPermissionAsync(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL,Permissions.CAMERA);
        return status == 'granted'
    }

    static async getFileAsync(allowsEditing=true){
        const allowed = await UploadMedia.getPermissionAsync();
        if(!allowed) return false;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing,
        })
        return result.cancelled ? false : result;
    }

    static async takePhotoAsync(allowsEditing=true){
        const allowed = await UploadMedia.getPermissionAsync();
        if(!allowed) return false;
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing
        })
        return result.cancelled ? false : result;
    }

}