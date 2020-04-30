import React from 'react';
import { Checkbox, Form, Input, Modal, Select, Button, Card, message, Switch } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';

const FormItem = Form.Item;




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

@connect(({ user }) => ({
  currentUser:user.currentUser,
}))
@Form.create()
class AddRole extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      pics: new Set(),
    };
  }

  showModal = checkNodeIds => {
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
    const { dispatch, form, currentUser } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
  
        values.createTime = new Date();
        values.createBy=currentUser.userName;
        values.status='0';
        dispatch({
          type: 'role/submitRole',
          payload: values,
        });

        setTimeout(() => {
          this.handleCancel();
          this.props.reload();
        }, 500);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      checkNodeIds,
    } = this.props;

    return (
      <React.Fragment>
        <Button
          type="primary"
          icon="plus"
          onClick={() => {
            this.showModal(checkNodeIds);
          }}
        >
          新增
        </Button>
        <Modal
          title={'新增字典'}
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
              <FormItem {...formItemLayout} label="角色名称">
                {getFieldDecorator('roleName', {
                  rules: [{ required: true, message: '此项为必填项' }],
                })(<Input style={{ width: '100%' }} />)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddRole;
