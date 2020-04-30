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

@connect()
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
    if (Array.isArray(checkNodeIds) && checkNodeIds.length > 0) {
      if (checkNodeIds.length === 1) {
        this.setState({
          visible: true,
        });
      } else {
        message.error('请选择一个字典类型新增字典！');
      }
    } else {
      message.error('请选择新增字典的类型！');
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSave = () => {
    const { dispatch, form, checkNodeIds } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        values.dictTypeId = checkNodeIds[0];
        if (values.isDefault) {
          values.isDefault = '1';
        } else {
          values.isDefault = '0';
        }
        dispatch({
          type: 'dict/submitDictForm',
          payload: values,
        });

        setTimeout(() => {
          this.handleCancel();
          this.props.reloadDict();
        }, 500);
      }
    });
  };

  render() {
    const record = this.props.record;
    const {
      form: { getFieldDecorator },
      checkNodeIds,
    } = this.props;

    return (
      <React.Fragment>
        <Button
          type="link"
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
              <FormItem {...formItemLayout} label="字典名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '此项为必填项' }],
                })(<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="字典值">
                {getFieldDecorator('value', {
                  rules: [{ required: true, message: '此项为必填项' }],
                })(<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="是否默认值">
                {getFieldDecorator('isDefault')(
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddRole;
