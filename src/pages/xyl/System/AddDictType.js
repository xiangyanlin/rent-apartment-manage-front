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
class AddDictType extends React.Component{

  constructor(props){
    super(props);

    this.state={
      visible:false,
      pics:new Set()
    };

  }

  showModal = (event) => {
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

    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dict/submitDictTypeForm',
          payload: values,
        });

        setTimeout(()=>{
          this.handleCancel();
          this.props.reloadDictType();
        },500)

      }
    });

  };



  render(){

   
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <React.Fragment>
        {/* <a onClick={() => {this.showModal()}}>编辑</a> */}
        <Button type="link" icon="plus" onClick={() => {this.showModal()}}>新增</Button>
        <Modal
          title={'新增字典类型'}
          width={640}
          visible={this.state.visible}
          onOk={()=>{this.handleSave()}}
          onCancel={()=>{this.handleCancel()}}
          destroyOnClose={true}
        >
          <div style={{overflow:'auto'}}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="字典类型名">
                {getFieldDecorator('dictTypeName',{ rules:[{ required: true, message:"此项为必填项" }]})
                (<Input style={{ width: '100%' }}  />)}
              </FormItem>
                <FormItem {...formItemLayout} label="字典类型描述">
                {getFieldDecorator('dictTypeDesc')
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

export default AddDictType;
