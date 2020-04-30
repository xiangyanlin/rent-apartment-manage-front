import React from 'react';
import {Checkbox, Form, Input, Modal,Select,Button,Card,message} from "antd";
import {connect} from "dva";
import { formatMessage, FormattedMessage } from 'umi/locale';


const FormItem = Form.Item;
const { TextArea } = Input;
  
  const children = [];
  for (let i = 1990; i <=2020; i++) {
    children.push(<Option key={ i}>{""+i}</Option>);
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

@connect(({ user }) => ({
  currentUser:user.currentUser,
}))
@Form.create()
class Authority extends React.Component{

  constructor(props){
    super(props);

    this.state={
      visible:false,
      pics:new Set()
    };

  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSave = () => {

    const { dispatch, form, record ,currentUser} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.id = record.id;
        values.updateTime=new Date();
        values.updateBy=currentUser.userName;
        values.roleKey=values.roleKey.join(",");
        console.log(values)
        dispatch({
          type: 'role/updateRole',
          payload: values,
        });

        setTimeout(()=>{
          this.handleCancel();
          this.props.reload();
        },500)

      }
    });

  };


  render(){

    const record = this.props.record;
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <React.Fragment>
        <a onClick={() => {this.showModal()}}>设置权限</a>
        <Modal
          title={'设置权限'}
          width={640}
          visible={this.state.visible}
          onOk={()=>{this.handleSave()}}
          onCancel={()=>{this.handleCancel()}}
          destroyOnClose={true}
        >
          <div style={{overflow:'auto'}}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="角色权限">
                {getFieldDecorator('roleKey',
                    {initialValue:record.roleKey?record.roleKey.split(','):[]  ,
                      rules:[{
                          required: true, message:"此项为必填项" 
                          }]})
                          (
                            <Checkbox.Group
                              options={[
                                { label: '分析面板', value: 'dashboard' },
                                { label: '房源管理', value: 'house' },
                                { label: '房东管理', value: 'owner' },
                                { label: '用户管理', value: 'consumer' },
                                { label: '合约管理', value: 'contract' },
                                { label: '资讯管理', value: 'news' },
                                { label: '问答管理', value: 'qa' },
                              ]}
                          />
                          )}
                </FormItem>
            </Form>
          </div>

        </Modal>
      </React.Fragment>
    )
  }

}

export default Authority;
