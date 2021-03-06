import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Divider,
  Tabs,
  Popconfirm,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import tabStyle from './style.less';
import styles from '../TableList.less';
import ShowPics from './ShowPics';
import EditResource from './EditResource';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
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

/* eslint react/no-multi-comp:0 */
@connect(({ houseResource, loading }) => ({
  houseResource,
  loading: loading.models.houseResource,
}))
@Form.create()
class Resource extends PureComponent {
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
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return this.covertStatus(record.status);
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
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
  auditColumns = [
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
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return this.covertStatus(record.status);
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            title="您确认通过此房源的审核吗？"
            onConfirm={() => {
              this.examine(record.id);
            }}
            onCancel={this.cancel}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">通过</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            title="您确认驳回此房源的审核吗？"
            onConfirm={() => {
              this.reject(record.id);
            }}
            onCancel={this.cancel}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">驳回</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  //删除确认框
  confirm = (rowId, e) => {
    //console.log(e);
    const { dispatch } = this.props;
    //console.log(rowId);
    dispatch({
      type: 'house/delete',
      payload: { id: rowId },
      callback: res => {
        console.log(res); // 请求完成后返回的结果
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({ type: 'houseResource/fetch' });
        }
      },
    });
  };
  //通过审核确认框
  examine = (rowId, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'house/updateHouseForm',
      payload: { id: rowId, status: '1' },
      callback: res => {
        if (res.code == 200) {
          message.success('审核成功');
        }
      },
    });
    this.reload1();
  };
  //拒绝审核确认框
  reject = (rowId, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'house/updateHouseForm',
      payload: { id: rowId, status: '3' },
      callback: res => {
        if (res.code == 200) {
          message.success('审核成功');
        }
      },
    });
    this.reload1();
  };
  covertStatus = status => {
    if (status == '0') {
      return '待审核';
    } else if (status == '1') {
      return '待租';
    } else if (status == '2') {
      return '租出';
    }
  };
  cancel = e => {
    console.log(e);
    message.error('Click on No');
  };


  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      payload:{status:["1","2","3"]}
    });
    dispatch({
      type: 'houseResource/getHouses',
      payload:{status:["0"]}
    });
  }

  reload() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      payload:{status:["1","2","3"]}
    });
  }
  reload1() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/getHouses',
      payload:{status:["0"]}
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'houseResource/fetch',
      payload: {},
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

    const { dispatch, form } = this.props;

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
        //type: 'rule/fetch',
        payload: values,
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
                  <Option value="1">住宅</Option>
                  <Option value="2">商住两用</Option>
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

  handleOnClick = e => {
    return this.props.history.push('/admin/house/addResource');
  };

  render() {
    const {
      houseResource: { data },
      houseResource:{houses},
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="房源管理">
        <Card bordered={false}>
          <div className={tabStyle.cardContainer}>
            <Tabs type={tabStyle.card}>
              <TabPane tab="已上线" key="1">
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderForm()}</div>
                  <Button type="primary" icon="plus" onClick={this.handleOnClick}>
                    新增
                  </Button>
                  <StandardTable
                    rowKey="id"
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </TabPane>
              <TabPane tab="待审核" key="2">
                <StandardTable
                  rowKey="id"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={houses}
                  columns={this.auditColumns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Resource;
