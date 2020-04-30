import React from 'react';
import {Checkbox, Form, Input, Modal,Select,Button,Card,message} from "antd";
import {connect} from "dva";
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;
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
class Answer extends React.Component{

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

    const { dispatch, form, record,currentUser} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        // 问答id
        values.id = record.id;
        values.status='2';
        values.answererId=currentUser.id;
        values.answerTime=new Date();
        dispatch({
          type: 'question/updateQuestions',
          payload: values,
          callback: res => {
             if (res.code == 200) {
               message.success('提交成功');
             }
           },
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
        <a onClick={() => {this.showModal()}}>回答</a>
        <Modal
          title={'回答问题'}
          width={640}
          visible={this.state.visible}
          onOk={()=>{this.handleSave()}}
          onCancel={()=>{this.handleCancel()}}
          destroyOnClose={true}
        >
          <div style={{overflow:'auto'}}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="回答问题">
              {getFieldDecorator('answer',
                  {initialValue:record.answer  ,
                    rules:[{
                        required: true, message:"此项为必填项" 
                        }]})
                        (
                        <TextArea style={{ width: '100%' }} autoSize={{ minRows: 12, maxRows: 30 }}
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

export default Answer;
