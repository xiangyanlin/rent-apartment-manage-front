import React from 'react';
import {Checkbox, Form, Input, Modal,Select,Button,Card,message} from "antd";
import {connect} from "dva";
import { formatMessage, FormattedMessage } from 'umi/locale';
const FormItem = Form.Item;
const { Option } = Select;
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
class EditNews extends React.Component{

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

    const { dispatch, form, record } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.state.pics.size > 0){
          values.pic = [...this.state.pics].join(',');
        }
        // 房源id
        values.id = record.id;

        dispatch({
          type: 'estate/updateEstateForm',
          payload: values,
        });

        setTimeout(()=>{
          this.handleCancel();
          this.props.reload();
        },500)

      }
    });

  };

  handleFileList = (obj)=>{
    let pics = new Set();
    obj.forEach((v, k) => {
      if(v.response){
        pics.add(v.response.name);
      }
      if(v.url){
        pics.add(v.url);
      }
    });

    this.setState({
      pics : pics
    })
  }

  render(){

    const record = this.props.record;
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <React.Fragment>
        <a onClick={() => {this.showModal()}}>编辑</a>
        <Modal
          title={'编辑'}
          width={640}
          visible={this.state.visible}
          onOk={()=>{this.handleSave()}}
          onCancel={()=>{this.handleCancel()}}
          destroyOnClose={true}
        >
          <div style={{overflow:'auto'}}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="楼盘名称">
                {getFieldDecorator('name',{initialValue:record.name  ,rules:[{ required: true, message:"此项为必填项" }]})(<Input style={{ width: '100%' }} disabled />)}
            </FormItem>
                <FormItem {...formItemLayout} label="所在地址" >
                {getFieldDecorator('address',
                    { initialValue:record.province+record.city+record.area+record.address ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (<Input style={{ width: '100%' }} disabled
                            />)}
                </FormItem>
                <FormItem {...formItemLayout} label="建筑年代">
                {getFieldDecorator('year',
                    {initialValue:record.year ,
                        rules:[{
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
                    {initialValue:record.type ,
                        rules:[{
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
                    {initialValue:record.propertyCost ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (<Input style={{ width: '30%' }} addonAfter="元/平" />
                            )}
                </FormItem>
                <FormItem {...formItemLayout} label="物业公司">
                {getFieldDecorator('propertyCompany',
                    {initialValue:record.propertyCompany ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (<Input style={{ width: '100%' }} 
                            />)}
                </FormItem>
                <FormItem {...formItemLayout} label="开发商">
                {getFieldDecorator('developers',
                    {initialValue:record.developers ,
                        rules:[{
                            required: true, message:"此项为必填项" 
                            }]})
                            (<Input style={{ width: '100%' }} 
                            />)}
                </FormItem>
            </Form>
          </div>

        </Modal>
      </React.Fragment>
    )
  }

}

export default EditNews;
