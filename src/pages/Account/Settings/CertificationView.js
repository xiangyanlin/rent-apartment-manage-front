import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage,FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Select, Row, Col, InputNumber  } from 'antd';
import styles from './PasswordView.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ user, loading }) => ({
  currentUser:user.currentUser,
   submitting: loading.effects['user/updateUserForm'],
}))
@Form.create()
class CertificationView extends Component {
  state = {
    display: "none",
  };

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { currentUser } = this.props;
    if(currentUser.roleId==3){
      this.setState({display:"block"});
    }
  }

  coverIidentify=()=>{
    const {currentUser}=this.props;
    if(currentUser.identify=="0"){
      return "未认证";
    }else if(currentUser.identify=="1"){
      return "已认证"
    }
  }
  
   handleChange=(value)=> {
    if(value=="3"){
      this.setState({display:"block"});
    }else{
      this.setState({display:"none"});
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch,currentUser } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        //const { prefix } = this.state;
        values.id=currentUser.id;
        values.identify="1";
        dispatch({
          type: 'user/updateUserForm',
          payload: {
            ...values,
          },
        });
      }
    });
  };


  render() {
    const { form, submitting ,currentUser} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <div style={{marginBottom:"10px"}}>
        <span>认证状态：</span><span className={styles.name}>{this.coverIidentify()}</span>
        </div>
      <Form onSubmit={this.handleSubmit}>
        {/* userName */}
          { currentUser.role=="1"?
                <div>认证身份：<span className={styles.name}>管理员</span></div>:
          <FormItem label="认证身份">
              {getFieldDecorator('roleId', {
                initialValue:currentUser.roleId  ,
                rules:[
                  { required: true, message:"此项为必填项" }
                ]})(
                <Select
                    onChange={this.handleChange}
                    style={{ width: 120 }} >
                  <Option value={2}>租客</Option>
                  <Option value={3} >房东</Option>
                </Select>
              )}
            </FormItem>}
            <FormItem label="房源数量" style={{display:this.state.display}}>
              {getFieldDecorator('houseNum', {
                initialValue:currentUser.houseNum})(<InputNumber min={1} max={100}   />
              )}
            </FormItem>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName', {
                initialValue:currentUser.realName  ,
                rules:[
                  { required: true, message:"此项为必填项" }
                ]})
                (
                  currentUser.identify=="0"?
                <Input placeholder={formatMessage({ id: 'form.realName.placeholder' })} />
                : <Input disabled  />
              )}
            </FormItem>
            <FormItem label="身份证号">
              {getFieldDecorator('idCard', {
                initialValue:currentUser.idCard  ,
                rules:[
                  { required: true, message:"此项为必填项" }
                ]})(
                currentUser.identify=="0"?
                <Input placeholder={formatMessage({ id: 'form.idCard.placeholder' })}/>
                : <Input disabled  />
              )}
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="app.password.identify" />
              </Button>
            </FormItem>
      </Form>
    </div>
    );
  }
}

export default CertificationView;
