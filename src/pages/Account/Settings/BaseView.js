import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button,Radio ,Avatar } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import avatar from '../../../assets/avatar.png';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const url="http://127.0.0.1:8080/common/getImage?filename=";
// 头像组件 方便以后独立，增加裁剪之类的功能
// const AvatarView = ({ avatar }) => (
//   <Fragment>

//   </Fragment>
// );



const validatorPhone = (rule, value, callback) => {
  // const values = value.split('-');
  if (!value) {
    callback('Please input your area code!');
  }
  // if (!values[1]) {
  //   callback('Please input your phone number!');
  // }
  callback();
};

@connect(({ loading,user,dict }) => ({
  dict:dict.dictMap,
  currentUser:user.currentUser,
  submitting: loading.effects['user/updateUserForm'],
}))
@Form.create()
class BaseView extends Component {
  state = {
    file: {  },
 
};
  componentDidMount() {
    this.setBaseInfo();
    const { dispatch } = this.props;
    const ids=new Array;
    ids.push(1,2,3,4);
    dispatch({
      type: 'dict/getDicts',
      payload:ids,
    });
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if(this.state.pics){
      return url+this.state.pics;
    }else if (currentUser.avatar) {
      return url+currentUser.avatar;
    }
    return avatar;
  }

  getViewDom = ref => {
    this.view = ref;
  };
  handleFile = (obj)=>{
    let pics= "";

       if(obj.response){
        pics =obj.response.name;
          }
      
       this.setState({
        pics : pics
      })
    }

  
  handleChange = ( file) => {
    this.setState( file );
    this.handleFile(this.state.file);
    this.refs.src=
    url+this.state.pics;
  }

  handleSubmit = e => {
    const { dispatch, form ,currentUser} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if(values.facilities){
            values.facilities = values.facilities.join(",");
          }
         values.id=currentUser.id;

          // 处理图片
          values.avatar = this.state.pics;

          dispatch({
                type: 'user/updateUserForm',
                payload: values,
            });

        }
    });
};

//从字典获取学历下拉选项
getEducationOptops=(dict)=>{

  let educationOptops=new Array;
  if(typeof(dict)!='undefined'&&dict!=null){
    for(var key in dict){
      if(key=='学历'&&Array.isArray(dict[key])&&dict[key].length>0){
        dict[key].forEach((Item,index)=>{
          educationOptops.push( <Option key={index} value={Item.value}>{Item.name}</Option>);
          })
      }
    }
  }
  
  return educationOptops;
}
  //从字典获取性别
getSexRadios=(dict)=>{

  let educationOptops=new Array;
  if(typeof(dict)!='undefined'&&dict!=null){
    for(var key in dict){
      if(key=='性别'&&Array.isArray(dict[key])&&dict[key].length>0){
        dict[key].forEach((Item,index)=>{
          educationOptops.push( <Radio key={index} value={Item.value}>{Item.name}</Radio>);
          })
      }
    }
  }
  
  return educationOptops;
}
  render() {
    //console.log(this.props);
    const { file } = this.state;
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const {dict}=this.props;
     

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
          <FormItem label="用户名">
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input disabled/>)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })
              (<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.sex' })}>
              {getFieldDecorator('sex')
              (     <Radio.Group >
                      {this.getSexRadios(dict)}
                    </Radio.Group>)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profession' })}>
              {getFieldDecorator('profession')
              (<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.education' })}>
              {getFieldDecorator('education')
              (<Select  style={{ width: 120 }} >
                {this.getEducationOptops(dict)}
              </Select>)}
            </FormItem>
            <FormItem style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
            </FormItem>
          </Form>
        </div>
        <div className={styles.right}>
            <div className={styles.avatar}>
              <Avatar ref="avatar" size={130}  src={this.getAvatarURL()} alt="avatar" />
            </div>
            <Upload file={file}
                    action="/xyl/common/picUpload"
                    onChange={this.handleChange}>
              <div className={styles.button_view}>
                <Button icon="upload">
                  <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
                </Button>
              </div>
            </Upload>
        </div>
      </div>
    );
  }
}

export default BaseView;
