import React from 'react';
import { Checkbox, Form, Input, Modal, Select, Button, Card, message, DatePicker } from 'antd';
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

@connect(({ dict, loading }) => ({
  dict,
  loading: loading.models.dict,
}))
@Form.create()
class EdictDictType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      dictTypeId: {},
    };
  }

  getDictType = id => {
    const { dispatch } = this.props;

    dispatch({
      type: 'dict/dictTypeOne',
      payload: { id: id },
    });
  };
  componentWillUpdate(nextProps, nextState) {
    this.props = nextProps;
  }
  showModal = checkNodeIds => {
    if (Array.isArray(checkNodeIds) && checkNodeIds.length > 0) {
      if (checkNodeIds.length === 1) {
        this.setState({
          visible: true,
          dictTypeId: checkNodeIds[0],
        });
        this.getDictType(checkNodeIds[0]);
      } else {
        message.error('请选择一个类型编辑！');
      }
    } else {
      message.error('请选择需要编辑的类型！');
    }
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
        values.id = this.state.dictTypeId;

        dispatch({
          type: 'dict/updateDictTypeForm',
          payload: values,
        });

        setTimeout(() => {
          this.handleCancel();
          this.props.reloadDictType();
        }, 500);
      }
    });
  };

  handleFileList = obj => {
    let pics = new Set();
    obj.forEach((v, k) => {
      if (v.response) {
        pics.add(v.response.name);
      }
      if (v.url) {
        pics.add(v.url);
      }
    });

    this.setState({
      pics: pics,
    });
  };

  render() {
    const { loading, checkNodeIds } = this.props;
    const { type } = this.props.dict;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <React.Fragment>
        {/* <a onClick={() => {this.showModal()}}>编辑</a> */}
        <Button
          type="link"
          icon="edit"
          onClick={() => {
            this.showModal(checkNodeIds);
          }}
        >
          编辑
        </Button>
        <Modal
          title={'编辑'}
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
              <FormItem {...formItemLayout} label="字典类型名">
                {getFieldDecorator('dictTypeName', {
                  initialValue: type.dictTypeName,
                  rules: [{ required: true, message: '此项为必填项' }],
                })(<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="字典类型描述">
                {getFieldDecorator('dictTypeDesc', { initialValue: type.dictTypeDesc })(
                  <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EdictDictType;
