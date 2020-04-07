import React from 'react';
import { Modal, Button, Carousel, Form, Input } from 'antd';
import { connect } from "dva";
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const InputGroup = Input.Group;

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
const submitFormLayout = {
  wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
  },
};

@connect(({ loading }) => ({
  submitting: loading.effects['login/frontLogin'],
}))
@Form.create()
class LoginModal extends React.Component {
  state = {
    visible: this.props.visible
  }




  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    console.log(this)
    this.setState({ visible: false })
    form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          
          dispatch({
            type: 'login/frontLogin',
            payload: {
              ...values,
            },
            callback: () => {
              this.setState({
                visible: false,
              });
            },
          });
        }
    });
    
};

  handleCancel = () => {
    this.setState({ visible: false })
  };


  //接收父组件属性前
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps)
    this.setState({ visible: nextProps.visible })
  }

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { submitting } = this.props;
    return (
      <div>
        <Modal
          title={'登录'}
          width={640}
          visible={this.state.visible}
          // onOk={() => { this.handleSubmit() }}
          onCancel={() => { this.props.handleCancelLogin()}}
          destroyOnClose={true}
           footer={null}
        >
          <div style={{ overflow: 'auto' }}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="用户名">
                  {getFieldDecorator('userName',{rules:[{ required: true, message:"此项为必填项" }]})
                  (<Input  />)}  
              </FormItem>
              <FormItem {...formItemLayout} label="密&ensp;&ensp;码">
                  {getFieldDecorator('password',{rules:[{ required: true, message:"此项为必填项" }]})
                  (<Input />)}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                      <FormattedMessage id="app.login.login" /> 
                  </Button>
              </FormItem>
            </Form>
          </div>

        </Modal>
      </div>
    );
  }
}

export default LoginModal;
