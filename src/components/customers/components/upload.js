import React from 'react'
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone'
import './index.scss'

class UploadComponent extends React.Component {
    constructor(props) {
        super()
        this.state = {
            loading: false,
            base64Image: '',
            value: props.value
        };
        this.getBase64 = this.getBase64.bind(this)
        this.handleDeleteImage = this.handleDeleteImage.bind(this)
    }

    getBase64(file) {
        const self = this
        console.log(file)
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            self.setState({ base64Image: reader.result })
            self.props.getImageBase64(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    handleDeleteImage() {
        this.setState({ base64Image: '' })
        this.props.getImageBase64('')
    }

    render() {
        return (
            <>
                <Dropzone onDrop={acceptedFiles => this.getBase64(acceptedFiles[0])}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {this.state.base64Image === '' ?
                                    (this.props.value ?
                                        <img src={this.props.value} style={{ height: '100%', width: '100%' }} /> :
                                        <div className='dropzone-empty'>Select or Drag a file.</div>) :
                                    <img src={this.state.base64Image} style={{ height: '100%', width: '100%' }} />
                                }
                            </div>
                        </section>
                    )}
                </Dropzone>
                {this.state.base64Image !== '' && <a onClick={() => this.handleDeleteImage()}>Delete</a>}
            </>
        );
    }
}

export default UploadComponent;
