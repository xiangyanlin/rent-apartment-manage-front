import React from 'react';
import {Checkbox, Form, Input, Modal,Select,Button,Card,message} from "antd";
import {connect} from "dva";
import { formatMessage, FormattedMessage } from 'umi/locale';
import PicturesWall from '../Utils/PicturesWall';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
  
  const children = [];
  for (let i = 1990; i <=2020; i++) {
    children.push(<Option key={ i}>{""+i}</Option>);
  }

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

@connect()
@Form.create()
class Authority extends React.Component{

  constructor(props){
    super(props);

    this.state={
      visible:false,
      pics:new Set()
    };

  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSave = () => {

    const { dispatch, form, record } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.state.pics.size > 0){
          values.pic = [...this.state.pics].join(',');
        }
        // 资讯id
        values.id = record.id;
        values.updateTime=new Date();
        dispatch({
          type: 'news/updateInformation',
          payload: values,
        });

        setTimeout(()=>{
          this.handleCancel();
          this.props.reload();
        },500)

      }
    });

  };

  handleFileList = (obj)=>{
    let pics = new Set();
    obj.forEach((v, k) => {
      if(v.response){
        pics.add(v.response.name);
      }
      if(v.url){
        pics.add(v.url);
      }
    });

    this.setState({
      pics : pics
    })
  }

  render(){

    const record = this.props.record;
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <React.Fragment>
        <a onClick={() => {this.showModal()}}>编辑</a>
        <Modal
          title={'编辑'}
          width={640}
          visible={this.state.visible}
          onOk={()=>{this.handleSave()}}
          onCancel={()=>{this.handleCancel()}}
          destroyOnClose={true}
        >
          <div style={{overflow:'auto'}}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="资讯标题">
              {getFieldDecorator('title',
                  {initialValue:record.title  ,
                    rules:[{
                        required: true, message:"此项为必填项" 
                        }]})
                        (<Input style={{ width: '100%' }} 
                        />)}
              </FormItem>
              <FormItem {...formItemLayout} label="资讯简介">
              {getFieldDecorator('summary',
                  {initialValue:record.summary  ,
                    rules:[{
                        required: true, message:"此项为必填项" 
                        }]})
                        (<TextArea style={{ width: '100%' }} autosize={{ minRows: 2, maxRows: 6 }}
                        />)}
              </FormItem>
              <FormItem {...formItemLayout} label="资讯内容">
              {getFieldDecorator('content',
                  {initialValue:record.content  ,
                    rules:[{
                        required: true, message:"此项为必填项" 
                        }]})
                        (
                        <TextArea style={{ width: '100%' }} autosize={{ minRows: 12, maxRows: 30 }}
                        />
                        )}
              </FormItem>
              <FormItem {...formItemLayout} label="上传资讯图">
                  <PicturesWall handleFileList={this.handleFileList.bind(this)}/>
              </FormItem>
            </Form>
          </div>

        </Modal>
      </React.Fragment>
    )
  }

}

export default Authority;
