import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Form,Input,DatePicker,Select,Button,Card,Checkbox,message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PicturesWall from '../Utils/PicturesWall';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;



const children = [];
for (let i = 1990; i <=2020; i++) {
  children.push(<Option key={ i}>{""+i}</Option>);
}


@connect(({loading,user}) => ({
    submitting: loading.effects['news/submitInformationForm'],
    currentUser:user.currentUser
}))
@Form.create()
class AddNews extends PureComponent {

    handleSubmit = e => {
      const { dispatch, form ,currentUser} = this.props;
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
          if (!err) {

            // 处理图片
            values.pic = [...this.state.pics].join(',');
            values.publishTime=new Date();
            values.publisher=currentUser.userName;
            dispatch({
                  type: 'news/submitInformationForm',
                  payload: values,
                  callback: res => {
                    if (res.code == 200) {
                      message.success('提交成功');
                      dispatch({ type: 'news/fetch' });
                    }
                  },
              });
  
          }
      });
    };

    handleSearch = (value)=>{
    let arr = new Array();
    if(value.length > 0 ){
      this.props.estate.estateMap.forEach((v, k) => {
        if(k.startsWith(value)){
          arr.push(k);
        }
      });
    }
    this.setState({
      estateDataSource: arr
    });
  } ;

  handleFileList = (obj)=>{
    let pics = new Set();
    obj.forEach((v, k) => {
       if(v.response){
         pics.add(v.response.name);
       }
    });

    this.setState({
      pics : pics
    })
  }


  constructor(props){
      super(props);
      this.state = {
        estateDataSource : [],
        estateAddress : '',
        estateId : '',
        pics :[]
      }
    }



    render() {
        const { submitting } = this.props;
        const {
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

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



        return (
            <PageHeaderWrapper>
                <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                    <Card bordered={false} title="发布资讯">
                        <FormItem {...formItemLayout} label="资讯标题">
                        {getFieldDecorator('title',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="资讯简介">
                        {getFieldDecorator('summary',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<TextArea style={{ width: '100%' }} autosize={{ minRows: 2, maxRows: 6 }}
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="资讯内容">
                        {getFieldDecorator('content',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (
                                  <TextArea style={{ width: '100%' }} autosize={{ minRows: 12, maxRows: 30 }}
                                  />
                                 )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="上传资讯图">
                            <PicturesWall handleFileList={this.handleFileList.bind(this)}/>
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                <FormattedMessage id="form.submit" />
                            </Button>
                            <Button style={{ marginLeft: 8 }}>
                                <FormattedMessage id="form.save" />
                            </Button>
                        </FormItem>
                    </Card>
                </Form>
            </PageHeaderWrapper >
        );
    }
}

export default AddNews;
