import React from 'react';
import { Checkbox, Form, Input, Modal, Select, Button, Card, message, Switch } from 'antd';
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
    if(Array.isArray(roles)){
      return roles.reduce((pre, item) => {
          pre.push((
              <Option key={item.id} value={item.id}>{item.roleName}</Option>
          ))
          console.log(pre)
          return pre
      }, [])
    }

  }

  getEducationOptops=()=>{
    const dict= this.props.dict;
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
    const { dispatch, form, type } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          if(type=='edit'){

            dispatch({
              type: 'user/updateUserForm',
              payload: values,
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

  render() {
    const {type,roles}= this.props;
    console.log(this.props);
    let record=this.props.record;
    let title = ''
    let label=''
    if(type==='add'){
      record={}
      label = "新增"
      title='新增用户'
    }else{
      label = "编辑"
      title='编辑用户'
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
                  rules: [{ required: true, message: '此项为必填项' }],
                })(<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                  initialValue:record.password,
                  rules: [{ required: true, message: '此项为必填项' }],
                })(<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="设置角色">
                {getFieldDecorator('roleId',{initialValue:record.roleId})(
                  <Select style={{ width: '100%' }} placeholder="请选择角色" >
                   { this.getOption()}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="邮箱">
                {getFieldDecorator('email',{initialValue:record.email})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="手机号">
                {getFieldDecorator('mobile',{initialValue:record.mobile})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="性别">
                {getFieldDecorator('sex',{initialValue:record.sex})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="真实姓名">
                {getFieldDecorator('realName',{initialValue:record.realName})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="身份证号">
                {getFieldDecorator('idCard',{initialValue:record.idCard})
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
