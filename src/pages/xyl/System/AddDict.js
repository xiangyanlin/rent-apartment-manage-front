import React from 'react';
import {Checkbox, Form, Input, Modal,Select,Button,Card,message,DatePicker} from "antd";
import {connect} from "dva";
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';

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
class AddDict extends React.Component{

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
        // 房源id
        values.id = record.id;

        dispatch({
          type: 'vist/updateVistRequestForm',
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
              <FormItem {...formItemLayout} label="租客姓名">
                {getFieldDecorator('tenantName',{initialValue:record.tenantName  ,rules:[{ required: true, message:"此项为必填项" }]})(<Input style={{ width: '100%' }} disabled />)}
            </FormItem>
                <FormItem {...formItemLayout} label="租客电话" >
                {getFieldDecorator('mobile',
                    { initialValue:record.mobile,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (<Input style={{ width: '100%' }} disabled
                            />)}
                </FormItem>
                <FormItem {...formItemLayout} label="请求时间">
                {getFieldDecorator('request_time',
                    {initialValue:moment(record.request_time),
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (
                                <DatePicker   disabled/>
                            )}
                </FormItem>
                <FormItem {...formItemLayout} label="看房时间">
                {getFieldDecorator('vist_time',
                    {initialValue:moment(record.vist_time) ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (
                                <DatePicker  />
                            )}
                </FormItem>
                <FormItem {...formItemLayout} label="备注信息">
                {getFieldDecorator('remark',
                    {initialValue:record.remark ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (<TextArea
                                autoSize={{ minRows: 2, maxRows: 6 }}
                              />
                            )}
                </FormItem>

            </Form>
          </div>

        </Modal>
      </React.Fragment>
    )
  }

}

export default AddDict;
