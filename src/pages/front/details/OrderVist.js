import React from 'react';
import {Checkbox, Form, Input, Modal,DatePicker } from "antd";
import {connect} from "dva";
import LoginModal from "../LoginModal";

const FormItem = Form.Item;
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

@connect(({  user,loading }) => ({
    currentUser:user.currentUser,
    submitting: loading.effects['vistRequset/submitVistForm'],
  }))
@Form.create()
class OrderVist extends React.Component{

  constructor(props){
    super(props);

    this.state={
      visible:false,
      pics:new Set(),
      login:false,
    };

  }
  isLogin=()=>{
    const userName=window.localStorage.getItem("currentUser");
    //console.log(userName);
    if(userName==null){
      this.showLoginModal();
    }else{
      this.showModal();
    }
  }

  showLoginModal=()=>{
      this.setState({
        login: true
      });
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

  handleCancelLogin = () => {
    this.setState({
      login: false,
    });
  };


handleSave = () => {

  const { dispatch, form, currentUser,data} = this.props;
  form.validateFieldsAndScroll((err, values) => {
    console.log(values);
    //
    if (!err) {

      values.tenantName=currentUser.realName;
      values.mobile=currentUser.mobile;
      values.estateId=data.estateId;
      values.requestTime= new Date();
      values.status="2";
      dispatch({
        type: 'vistRequset/submitVistForm',
        payload: values,
    });
      setTimeout(()=>{
        this.handleCancel();
      },500)

    }
  });

};



  render(){

    const record = this.props.record;
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <React.Fragment>
        <a onClick={() => {this.isLogin()}}>预约看房</a>
        <LoginModal handleCancelLogin={this.handleCancelLogin}visible={this.state.login}/>
        <Modal
          title={'填写信息'}
          width={640}
          visible={this.state.visible}
          onOk={()=>{this.handleSave()}}
          onCancel={()=>{this.handleCancel()}}
          destroyOnClose={true}
        >
          <div style={{overflow:'auto'}}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              {/* <FormItem {...formItemLayout} label="租客电话">
                <InputGroup compact>
                  {getFieldDecorator('mobile')(<Input style={{ width: '50%' }}  />)}
                </InputGroup>
              </FormItem> */}
              {/* <FormItem {...formItemLayout} label="房源小区名">
                <InputGroup compact>
                  {getFieldDecorator('village')(<Input style={{ width: '40%' }}  />)}
                </InputGroup>
              </FormItem> */}
              <FormItem {...formItemLayout} label="看房时间">
                <InputGroup compact>
                  {getFieldDecorator('vistTime',{rules:[{ required: true, message:"此项为必填项" }]})
                  (<DatePicker showTime  />)}
                </InputGroup>
              </FormItem>
              <FormItem {...formItemLayout} label="备注信息">
                {getFieldDecorator('remark')
                (<TextArea placeholder="请输入备注信息"  />)}
              </FormItem>
            </Form>
          </div>

        </Modal>
      </React.Fragment>
    )
  }

}

export default OrderVist;
