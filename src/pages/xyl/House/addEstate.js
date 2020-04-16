import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Form,Input,DatePicker,Select,Button,Card,InputNumber,Radio,Icon,Tooltip,Checkbox,AutoComplete} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;



@connect(
  ({ loading}) => ({
    submitting: loading.effects['estate/submitEstateForm'],
    loading: loading.models.estate,
}))
@Form.create()
class AddEstate extends PureComponent {

  componentDidMount() { //当组件挂载完成后执行加载数据
    console.log("loading.......");
    const { dispatch } = this.props;
    dispatch({
      type: 'estate/fetch',
      // type: 'rule/fetch',
    });
  }
    handleSubmit = e => {
        const { dispatch, form } = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              if(values.facilities){
                values.facilities = values.facilities.join(",");
              }
              if(values.floor_1 && values.floor_2){
                values.floor = values.floor_1 + "/" + values.floor_2;

              }

              // 楼盘id
              values.estateId =  this.state.estateId;

              // 处理图片
              values.pic = [...this.state.pics].join(',');

              dispatch({
                    type: 'house/submitHouseForm',
                    payload: values,
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
        console.log(this.props);
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
                    <Card bordered={false} title="楼盘信息">
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
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

export default AddEstate;
