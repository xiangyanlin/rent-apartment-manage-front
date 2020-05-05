import React from 'react';
import { Checkbox, Form, Input, Modal, Select, Button, DatePicker , message, Radio } from 'antd';
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

@connect(({dict, contract, loading }) => ({
    contract,
  dict:dict.dictMap,
}))
@Form.create()
class EditContract extends React.Component {
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
              type: 'contract/updateContract',
              payload: values,
              callback: res => {
                if (res.code == 200) {
                  message.success('修改成功');
                }
              },
            });
    
          }
          if(type=='add'){
              values.status="2"
            dispatch({
              type: 'contract/submitContract',
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

 
  render() {
    const {type,roles}= this.props;
    let record=this.props.record;
    let title = ''
    let label=''
    let  editable=false
    if(type==='add'){
      record={}
      label = "新增"
      title='新增合约'
    }else{
      label = "编辑"
      title='编辑合约'
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
              <FormItem {...formItemLayout} label="物业地址">
                {getFieldDecorator('address',{initialValue:record.address})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="房源编号">
                {getFieldDecorator('houseId',{initialValue:record.houseId})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="业主姓名">
                {getFieldDecorator('ownerName',{initialValue:record.ownerName})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="客户姓名">
                {getFieldDecorator('tenantName',{initialValue:record.tenantName})
                (<Input style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="签约日期">
                {getFieldDecorator('startTime',
                    {initialValue:moment(record.startTime) ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (
                                <DatePicker  />
                            )}
                </FormItem>
                <FormItem {...formItemLayout} label="到期日期">
                {getFieldDecorator('endTime',
                    {initialValue:moment(record.endTime) ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (
                                <DatePicker  />
                            )}
                </FormItem>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EditContract;
