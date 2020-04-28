import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Form,Input,DatePicker,Select,Button,Card,Checkbox,message} from 'antd';
import styles from './Question.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({loading,user}) => ({
    submitting: loading.effects['question/submitQuestions'],
    currentUser:user.currentUser
}))
@Form.create()
class Contract extends PureComponent{

    handleSubmit = e => {
        const { dispatch, form ,currentUser} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
  

              values.quizTime=new Date();
              values.questionerId=currentUser.id;
              values.status='1';
              dispatch({
                    type: 'question/submitQuestions',
                    payload: values,
                    callback: res => {
                      if (res.code == 200) {
                        message.success('提交成功');
                      }
                    },
                });
    
            }
        });
      };
  
    render(){
        const { submitting } = this.props;
        const {
            form: { getFieldDecorator, getFieldValue },
        } = this.props;
        return (
            <div className={styles.container}>
                <Card style={{padding:"0 5%",minHeight:"550px"}}
                    title='发布提问'>
                    <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem label="一句话描述您的疑问">
                        {getFieldDecorator('questions',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem  label="问题描述">
                        {getFieldDecorator('summary')
                                 (<TextArea style={{ width: '100%' }} autoSize ={{ minRows: 4, maxRows: 6 }}
                                 placeholder='描述尽量详细，以便顾问能够回答的更精确~'
                                  />)}
                        </FormItem>
                        <FormItem  style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting} block>
                                <FormattedMessage id="form.submit" />
                            </Button>
                        </FormItem>
                </Form>
                </Card>
            </div>
        );
    }
}

export default Contract;