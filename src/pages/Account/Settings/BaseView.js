import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button,Radio } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import avatar from '../../../assets/avatar.png';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
// const AvatarView = ({ avatar }) => (
//   <Fragment>

//   </Fragment>
// );

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

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

@connect(({ loading,user }) => ({
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
    if (currentUser.avatar) {
      return "http://127.0.0.1:8080/common/getImage?filename="+currentUser.avatar;
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
    console.log(this.state.pics);
    document.getElementById('avatar').src="http://127.0.0.1:8080/common/getImage?filename="+this.state.pics;
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

  render() {
    const { file } = this.state;
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
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
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem> */}
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
              (      <Radio.Group >
                      <Radio value={"0"}>未知</Radio>
                      <Radio value={"1"}>男</Radio>
                      <Radio value={"2"}>女</Radio>
                    </Radio.Group>)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profession' })}>
              {getFieldDecorator('profession')
              (<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.education' })}>
              {getFieldDecorator('education')
              (<Select  defaultValue="3" style={{ width: 120 }} >
                <Option value="1">专科以下</Option>
                <Option value="2">专科</Option>
                <Option value="3">本科</Option>
                <Option value="4">研究生</Option>
                <Option value="5">研究生以上</Option>
              </Select>)}
            </FormItem>
            {/* <FormItem >
              {getFieldDecorator('pic')
              (<Input  type="hidden" value={this.state.pics}/>)}
            </FormItem> */}
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
        {/* <FormItem {...formItemLayout} label="上传室内图">
            <PicturesWall handleFileList={this.handleFileList.bind(this)}/>
        </FormItem> */}
        <div className={styles.right}>
            <div className={styles.avatar}>
              <img id="avatar" src={this.getAvatarURL()} alt="avatar" />
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
