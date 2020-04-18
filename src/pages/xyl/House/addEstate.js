import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Form,Input,DatePicker,Select,Button,Card,InputNumber,Radio,Icon,Tooltip,Checkbox,message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GeographicView from '@/components/GeographicView';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;

const validatorGeographic = (rule, value, callback) => {
  const { province, city ,area} = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  if (!area.key) {
    callback('Please input your area!');
  }
  callback();
};

const children = [];
for (let i = 1990; i <=2020; i++) {
  children.push(<Option key={ i}>{""+i}</Option>);
}


@connect(
  ({ loading}) => ({
    submitting: loading.effects['estate/submitEstateForm'],
    loading: loading.models.estate,
}))
@Form.create()
class AddEstate extends PureComponent {
  state = { mode: 'year'};
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
            values.province=values.geographic.province.label;
            values.city=values.geographic.city.label;
            values.area=values.geographic.area.label;
             values.created=new Date();
             values.updated=new Date();
              dispatch({
                    type: 'estate/submitEstateForm',
                    payload: values,
                    callback: res => {
                      console.log(res); // 请求完成后返回的结果
                      if (res.code == 200) {
                        message.success('提交成功');
                      }
                    },
                });
              console.log(values);
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
                    <Card bordered={false} title="楼盘信息">
                        <FormItem {...formItemLayout} label="楼盘名称">
                        {getFieldDecorator('name',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem  {...formItemLayout} label={formatMessage({ id: 'app.settings.basic.geographic' })}>
                          {getFieldDecorator('geographic', {
                            rules: [
                              {
                                required: true,
                                message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                              },
                              {
                                validator: validatorGeographic,
                              },
                            ],
                          })(<GeographicView />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="具体地址">
                        {getFieldDecorator('address',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="建筑年代">
                        {getFieldDecorator('year',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (
                                  <Select  style={{ width: '40%' }} placeholder="请选择年份" >
                                    {children}
                                  </Select>
                                 )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="建筑类型">
                        {getFieldDecorator('type',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (
                                  <Select  style={{ width: 120 }} >
                                    <Option value="1">塔楼</Option>
                                    <Option value="2">板楼</Option>
                                  </Select>
                                 )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="物业费">
                        {getFieldDecorator('propertyCost',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '30%' }} addonAfter="元/平" />
                                 )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="物业公司">
                        {getFieldDecorator('propertyCompany',
                            {rules:[{
                                 required: true, message:"此项为必填项" 
                                 }]})
                                 (<Input style={{ width: '100%' }} 
                                  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="开发商">
                        {getFieldDecorator('developers',
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
