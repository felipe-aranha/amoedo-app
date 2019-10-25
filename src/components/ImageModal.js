import React from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { View, Image, Modal, TouchableHighlight, TouchableOpacity, Dimensions, Keyboard, PixelRatio, ScrollView } from 'react-native';
import { mainStyle } from '../style'; 
import ImageZoom from 'react-native-image-pan-zoom';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenOrientation } from 'expo';
import ImageViewer from 'react-native-image-zoom-viewer';


/* 
interface DataSource {
  url: string;
  width?: number,
  height?: number,
}

interface ImageModalProps {
  position?: number,
  onPositionChanged?: Function,
  dataSource?: DataSource[],
  width?: number,
  height?: number
  visible?: boolean,
  onRequestClose?: Function
}

interface ImageModalState {
  modal: boolean,
  activeItem: number,
  width: number,
  height: number,
  maxHeight: number
}
*/

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

const calcAttachmentSize = async (item, currentWidth=deviceWidth) => {
    let w = item.width;
    let h = item.height;
    const maxHeight = PixelRatio.roundToNearestPixel(_height*(80/100));
    if(item.width > currentWidth){
        w = currentWidth;
        let proportion = ((100*w)/item.width)/100
        h = item.height * proportion;
    }
    if(h > maxHeight){
        h = maxHeight;
        let proportion = ((100*maxHeight)/h)/100;
        w = w * proportion ;
        h = maxHeight;
    }
    return {
        width: w,
        height: h
    }
}

export default class ImageModal extends React.PureComponent{

    constructor(props,state){
        super(props,state);
        this.state = {
            activeItem: this.props.position ? this.props.position : 0,
            modal: false,
            width: this.props.width || _width,
            height: this.props.height || _height,
            maxHeight: 0
        }
        Dimensions.addEventListener('change', this.handleOrientationChange.bind(this));
    }

    componentDidMount(){
        let maxHeight = 0;
        if(this.props.dataSource){
            this.props.dataSource.map( item => {
                const size = calcAttachmentSize(item,this.state.width);
                if(size.height > maxHeight){
                    maxHeight = size.height;
                }
            })
            if(maxHeight > 0)
                this.setState({
                    maxHeight
                })
        }
    }

    componentWillUnmount(){
        Dimensions.removeEventListener('change', this.handleOrientationChange.bind(this));
    }

    async handleOrientationChange(dimensions){
        if(this.state.modal)
            this.setState({
                width: dimensions.screen.width,
                height: dimensions.screen.height
            })
        else 
            this.setState({
                width: this.props.width || _width,
                height: this.props.height || _height
            })
    }

    carousel = null;

    toggleModal(){
        this.setState({
            modal: !this.state.modal
        }, async () => {
            if(this.state.modal){
                ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);  
            } else {
                ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
            }
        });
        Keyboard.dismiss();
    }


    renderImage(item){
        const size = calcAttachmentSize(item,this.state.width);
        return <Image
                    source={{uri: item.url}}
                    style={{
                        width: size.width, 
                        height: size.height
                    }}
                    resizeMode={'contain'}
                />
    }

    renderImageZoom(item){
        const size = calcAttachmentSize(item,this.state.width);
        if(this.state.modal) 
            return (
                <ImageZoom 
                    cropWidth={this.state.width}
                    cropHeight={this.state.height}
                    imageWidth={size.width}
                    imageHeight={size.height}
                    panToMove={false}
                    onClick={() => {
                        this.toggleModal()
                    }}
                >
                    {this.renderImage(item)}
                </ImageZoom>
            )
        else 
            return this.renderImage(item);
    }

    renderItem({item,index}){
        return(
            <TouchableHighlight 
                onPress={() => {this.toggleModal()}}
                key={index}
                style={{
                    width: this.state.width,
                    backgroundColor: 'transparent',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: this.state.modal ? this.state.height : this.state.maxHeight
                }}
            >
                {this.renderImageZoom(item)}
            </TouchableHighlight>
        )
    }

    handleSnapTopItem(index){
        if(this.props.onPositionChanged) this.props.onPositionChanged(index);
        this.setState({
            activeItem: index
        })
    }

    renderCenter(){
        return(
            <ScrollView
                horizontal
            >
                {this.props.dataSource.map( (image, i) => {
                    return (
                        <TouchableOpacity onPress={() => { 
                            this.handleSnapTopItem(i);
                            this.toggleModal();
                         }}>
                            <Image 
                                source={{uri: image.url}} 
                                style={{
                                    width: 100,
                                    height: 100,
                                    margin: 5
                                }}
                            />
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }

    _renderCenter(){
        return(
            <View>
                <Carousel 
                    ref={ref => this.carousel = ref}
                    data={this.props.dataSource}
                    renderItem={this.renderItem.bind(this)}
                    sliderWidth={this.state.width}
                    itemWidth={this.state.width}
                    windowSize={1}
                    firstItem={this.state.activeItem}
                    onSnapToItem={this.handleSnapTopItem.bind(this)}
                    removeClippedSubviews={false}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                />
                {!this.state.modal && this.props.dataSource.length > 1 &&
                    <Pagination 
                        dotsLength={this.props.dataSource.length}
                        activeDotIndex={this.state.activeItem}
                        containerStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.1)', 
                            position: 'absolute', 
                            bottom: -10, 
                            alignSelf: 'center', 
                            width: '100%',
                            paddingVertical: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginBottom: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.92)'
                        }}
                        inactiveDotStyle={{
                            backgroundColor: 'rgba(236,236,236,0.92)'
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                }
            </View>
        )
    }

    renderModal(){
        const images = this.props.dataSource.map(item => {
            return {
                url: item.url,
                width: item.width,
                height: item.height ,
                props: {
                    resizeMode: 'cover'
                }
            }
        });
        return <Modal
                transparent={false}
                visible={this.state.modal}
                supportedOrientations={[
                    'portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'
                ]}
                onRequestClose={() => {
                    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
                }}
            >


                <ImageViewer 
                    imageUrls={images}
                    index={this.state.activeItem}
                    saveToLocalByLongPress={false}
                    onChange={ index => {
                        this.setState({
                            activeItem: index
                        })
                    }}
                    renderIndicator={() => <View></View>}
                    renderHeader={() =>
                        <TouchableOpacity style={mainStyle.imageModalCloseArea} onPress={this.toggleModal.bind(this)}>
                            <FontAwesome 
                            style={{ 
                                textAlign:'left',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 20
                            }} 
                            name="close"  
                            />
                        </TouchableOpacity> 
                    }
                />

        </Modal>
    }

    render(){        
        if (this.state.modal){
            return this.renderModal();
        } else return this.renderCenter();
    }
}

export class ImageModalOnly extends ImageModal{

    constructor(props,state){
        super(props,state);
        this.state = {
            ...state,
            modal: this.props.visible || false
        }
    }

    static getDerivedStateFromProps(props,state){
        if(props.visible != state.modal)
            return {
                modal: props.visible
            }
        else 
            return null
    }

    toggleModal(){
        super.toggleModal();
        if(this.props.onRequestClose)
            this.props.onRequestClose()
    }
    render(){
        return this.state.modal ? this.renderModal() : <React.Fragment />
    }
}
