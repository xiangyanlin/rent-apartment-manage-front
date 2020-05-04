import React from 'react';
import { Checkbox, Form, Input, Modal, Select, Button, Card, message, Radio } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

const children = [];
for (let i = 1990; i <= 2020; i++) {
  children.push(<Option key={i}>{'' + i}</Option>);
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

@connect(({dict, role, loading }) => ({
  role,
  dict:dict.dictMap,
}))
@Form.create()
class EditUser extends React.Component {
  state={
    click:""
  }
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      pics: new Set(),
    };
  }

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getRoles',
    });
    const ids=new Array;
    ids.push(1,2,3,4);
    dispatch({
      type: 'dict/getDicts',
      payload:ids,
    });
  }
  //角色
  getOption = () => {
    const roles = this.props.role.roles
    let disabled=false;
    if(Array.isArray(roles)){
      return roles.reduce((pre, item) => {
        disabled=false;
        if(item.id===1){
          disabled=true;
        }
          pre.push((
              <Option key={item.id} value={item.id} disabled={disabled}>{item.roleName}</Option>
          ))
          return pre
      }, [])
    }

  }

  getEducationOptops=()=>{
    let dict= this.props.dict;
    let educationOptops=new Array;
    if(typeof(dict)!='undefined'&&dict!=null){
      for(var key in dict){
        if(key=='学历'&&Array.isArray(dict[key])){
          dict[key].forEach((item,index)=>{
            educationOptops.push( <Option key={item.id} value={item.value}>{item.name}</Option>);
            })
        }
      }
    }
    return educationOptops
  }

  getSexRadios=()=>{
    let dict= this.props.dict;
    let sexOptops=new Array;
    if(typeof(dict)!='undefined'&&dict!=null){
      for(var key in dict){
        if(key=='性别'&&Array.isArray(dict[key])&&dict[key].length>0){
          dict[key].forEach((item,index)=>{
            sexOptops.push( <Radio key={item.id} value={item.value}>{item.name}</Radio>);
            })
        }
      }
    }
    
    return sexOptops;
  }

  showModal = () => {
    this.setState({
        visible: true,
    });

  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSave = () => {
    const { dispatch, form, type,record } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          if(type=='edit'){
            values.id=record.id;
            dispatch({
              type: 'user/updateUserForm',
              payload: values,
              callback: res => {
                if (res.code == 200) {
                  message.success('修改成功');
                }
              },
            });
    
          }
          if(type=='add'){
            dispatch({
              type: 'user/submitUser',
              payload: values,
              callback: res => {
                if (res.code == 200) {
                  message.success('新增成功');
                }
              },
            });
          }
          setTimeout(() => {
            this.handleCancel();
            this.props.reload();
          }, 500);
      }
    });
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {

      callback(formatMessage({ id: 'validation.password.required' }));
    } else {

      if (value.length < 6) {
        callback('请使用大于6位的密码');
      } else {
        callback();
      }
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };
  //校验用户名
  checkUserName = (rule, value, callback) => {
    const userName = value;
    if (userName) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/checkUserName',
        payload: {
          userName:userName,
        },
        callback: res => {
          console.log(res); // 请求完成后返回的结果
          if (res.code == 200) {
            callback(formatMessage({ id: 'validation.userName.wrong-format' }));
            callback('error');
          }
          callback();
        },
      });
    }else{
      callback(formatMessage({ id: 'validation.userName.required' }));
      callback('error');
      
    }
    
  };

  //  身份证校验规则
  checkLength = (rule, value, callback) => {
    if (this.checkIDCard(value)) {
      callback();
    } else {
      callback('请输入正确的身份证号码');
    }
  }

  checkIDCard = (value) => {
    // 加权因子
    const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    const check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    const code = value + '';
    const last = value[17];

    const seventeen = code.substring(0, 17);
    
	 // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    const arr = seventeen.split('');
    const len = arr.length;
    let num = 0;
    for (let i = 0; i < len; i += 1) {
      num += (arr[i] * weight_factor[i]);
    }

    // 获取余数
    const resisue = num % 11;
    const last_no = check_code[resisue];

	// 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    const idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    const format = idcard_patter.test(value);

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format;
  }


  render() {
    const {type,roles}= this.props;
    let record=this.props.record;
    let title = ''
    let label=''
    let  editable=false
    if(type==='add'){
      record={}
      label = "新增"
      title='新增用户'
    }else{
      label = "编辑"
      title='编辑用户'
      editable=true
    }
    const {
      form: { getFieldDecorator },
    
    } = this.props;

    return (
      <React.Fragment>
        <Button
          type="link"
          onClick={() => {
            this.showModal();
          }}
        >
         {label}
        </Button>
        <Modal
          title={title}
          width={640}
          visible={this.state.visible}
          onOk={() => {
            this.handleSave();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
          destroyOnClose={true}
        >
          <div style={{ overflow: 'auto' }}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('userName', {
                  initialValue:record.userName,
                  rules: [
                    type=='add'? 
                    { required: true,
                      validator: this.checkUserName
                    }:{ required: true,}
                  ],
                })(<Input style={{ width: '100%' }} disabled={editable}/>)}
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                  initialValue:record.password,
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(
                <Input type="password" style={{ width: '100%' }} disabled={editable}/>)}
              </FormItem>
              <FormItem {...formItemLayout} label="设置角色">
                {getFieldDecorator('roleId',{initialValue:record.roleId})(
                  <Select style={{ width: '100%' }} placeholder="请选择角色" >
                   { this.getOption()}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="邮箱">
                {getFieldDecorator('email',{initialValue:record.email,              
                rules: [
                {
                  type: 'email',
                  message: formatMessage({ id: 'validation.email.wrong-format' }),
                },
              ],})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="手机号">
                {getFieldDecorator('mobile',{initialValue:record.mobile,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.phone-number.required' }),
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                    },
                  ],})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="性别">
                {getFieldDecorator('sex',{initialValue:record.sex})
                (
                <Radio.Group  style={{ width: '100%' }} >
                  {this.getSexRadios()}
                </Radio.Group>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="真实姓名">
                {getFieldDecorator('realName',{initialValue:record.realName})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="身份证号">
                {getFieldDecorator('idCard',{initialValue:record.idCard,
                rules:[
                  {
                    validator: this.checkLength,
                  },
                ]})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="职业">
                {getFieldDecorator('profession',{initialValue:record.profession})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="学历">
                {getFieldDecorator('education',{initialValue:record.education})
                (
                  <Select style={{ width: '100%' }} placeholder="请选择学历" >
                        {this.getEducationOptops()}
                 </Select>
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EditUser;
