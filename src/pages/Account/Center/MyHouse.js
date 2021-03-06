import React, { PureComponent ,Fragment} from 'react';
import {   Row,Col,Card,Form,Input,Select, Icon,Button,Divider,Carousel,Popconfirm,message, } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import styles from '../../xyl/TableList.less';
import ShowPics from './ShowPics';
import EditResource from '../../xyl/House/EditResource.js';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const payType = new Map([
  [1, '付一押一'],
  [2, '付三押一'],
  [3, '付六押一'],
  [4, '年付押一'],
  [5, '其它'],
]);


@connect(({user, houseResource, loading }) => ({
  currentUser:user.currentUser,
  houseResource,
  loading: loading.models.houseResource,
}))
@Form.create()
class Center extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '房源编号',
      dataIndex: 'id',
    },
    {
      title: '房源信息',
      dataIndex: 'title',
    },
    {
      title: '图',
      dataIndex: 'pic',
      render: (text, record, index) => {
        return <ShowPics pics={text} />;
      },
    },
    {
      title: '楼栋',
      render: (text, record, index) => {
        return (
          record.buildingFloorNum + '栋' + record.buildingNum + '单元' + record.buildingUnit + '号'
        );
      },
    },
    {
      title: '支付方式',
      render: (text, record, index) => {
        return payType.get(record.paymentMethod);
      },
    },
    {
      title: '户型',
      dataIndex: 'houseType',
    },
    {
      title: '面积',
      dataIndex: 'useArea',
      render: (text, record, index) => {
        return text + '平方';
      },
    },
    {
      title: '楼层',
      dataIndex: 'floor',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => {}}>查看</a>
          <Divider type="vertical" />
          <EditResource record={record} reload={this.reload.bind(this)} />
          <Divider type="vertical" />
          <Popconfirm
            title="您确认要删除这条数据吗?"
            onConfirm={() => {
              this.confirm(record.id);
            }}
            onCancel={this.cancel}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  //删除确认框
  confirm = (rowId, e) => {
    const { currentUser,dispatch } = this.props;
    dispatch({
      type: 'house/delete',
      payload: { id: rowId },
      callback: res => {
        console.log(res); // 请求完成后返回的结果
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({
             type: 'houseResource/fetch' ,
             payload:{  ownerId:currentUser.id,}
            });
        }
      },
    });
  };

  cancel = e => {
    console.log(e);
    message.error('Click on No');
  };
  reload() {
    const { currentUser,dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      payload:{ ownerId:currentUser.id,},
    });
  }

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { currentUser,dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      payload:{ ownerId:currentUser.id,},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const {currentUser}=this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ownerId:currentUser.id,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    //
    dispatch({
      type: 'houseResource/fetch',
      payload: params,
    });
  };
  //重置
  handleFormReset = () => {
    const { currentUser,form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'houseResource/fetch',
      payload: {
        ownerId:currentUser.id,
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { currentUser,dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'houseResource/fetch',
        payload: {
          ownerId:currentUser.id,
          ...values,
        },
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 5, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            {getFieldDecorator('status')(
              <Select placeholder="房屋状态" style={{ width: '100%' }}>
                <Option value="1">待租</Option>
                <Option value="2">租出</Option>
              </Select>
            )}
          </Col>
          <Col md={4} sm={24}>
            {getFieldDecorator('title')(<Input placeholder="楼盘名称" />)}
          </Col>
          <Col md={4} sm={24}>
            {getFieldDecorator('used')(
              <Select placeholder="房屋类型" style={{ width: '100%' }}>
                <Option value="1">住宅</Option>
                <Option value="2">商住两用</Option>
              </Select>
            )}
          </Col>
          <Col md={4} sm={24}>
            {getFieldDecorator('houseType')(<Input placeholder="户型" />)}
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('status')(
                <Select placeholder="房屋状态" style={{ width: '100%' }}>
                  <Option value="0">待租</Option>
                  <Option value="1">租出</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('title')(<Input placeholder="楼盘名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('used')(
                <Select placeholder="房屋类型" style={{ width: '100%' }}>
                  <Option value="0">住宅</Option>
                  <Option value="1">商住两用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('houseType')(<Input placeholder="户型" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('id')(<Input placeholder="房源编号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <Row>
              <Col md={10} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('minRent')(<Input placeholder="价格" />)}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <div style={{ textAlign: 'center' }}>到</div>
              </Col>
              <Col md={10} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('maxRent')(<Input placeholder="价格" />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orientation')(<Input placeholder="朝向" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {/* {getFieldDecorator('name')(<Input placeholder="装修" />)} */}
              {getFieldDecorator('decoration')(
                <Select placeholder="装修" style={{ width: '100%' }}>
                  <Option value="1">精装</Option>
                  <Option value="2">简装</Option>
                  <Option value="3">毛坯</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log(this.props);
    const {
      houseResource: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
    <div>
       <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
    </div>
    );
  }
}

export default Center;
