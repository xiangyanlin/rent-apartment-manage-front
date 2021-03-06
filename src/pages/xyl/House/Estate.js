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
  Carousel,
  Popconfirm,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';
import EditEstate from './EditEstate';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');



/* eslint react/no-multi-comp:0 */
@connect(({ estate, loading }) => ({
    estate,
  loading: loading.models.estate,
}))
@Form.create()
class Estate extends PureComponent {
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
      title: '楼盘编号',
      dataIndex: 'id',
    },
    {
      title: '楼盘名称',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'pic',
      render: (text, record, index) => {
        return (
          record.province +  record.city  + record.area + record.address
        );
      },
    },
    {
      title: '建筑年代',
      dataIndex: 'year',
    },
    {
      title: '建筑类型',
      dataIndex: 'type',
    },
    {
      title: '物业费',
      dataIndex: 'propertyCost',
    },
    {
      title: '物业公司',
      dataIndex: 'propertyCompany',
    },
    {
      title: '开发商',
      dataIndex: 'developers',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <EditEstate record={record} reload={this.reload.bind(this)} />
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
    //console.log(e);
    const { dispatch } = this.props;
    //console.log(rowId);
    dispatch({
      type: 'estate/delete',
      payload: { id: rowId },
      callback: res => {
        console.log(res); // 请求完成后返回的结果
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({ type: 'estate/list' });
        }
      },
    });
  };

  cancel = e => {
    console.log(e);
    message.error('Click on No');
  };
  reload() {
    const { dispatch } = this.props;
    dispatch({
      type: 'estate/list',
    });
  }

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'estate/list',
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
      type: 'estate/list',
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
      type: 'estate/list',
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
        type: 'estate/list',
        payload: values,
      });
    });
  };



  handleOnClick=e=>{
     return this.props.history.push("/admin/house/addEstate")
  }

  render() {
    const {
      estate: { data },
      form: { getFieldDecorator, getFieldValue },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="楼盘管理">
        <Card bordered={false}>
          <div className={styles.tableList}>

            <Form onSubmit={this.handleSearch} layout="inline" style={{marginBottom:"10px"}}>
              <Row gutter={{ md: 5, lg: 24, xl: 48 }}>
                
                <Col md={8} sm={48}>
                  {getFieldDecorator('keyWord')(<Input placeholder="请输入" />)}
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit"   icon="search" >
                      搜索
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>
            <Button type="primary" icon="plus" onClick={this.handleOnClick}>新增</Button>
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
      </PageHeaderWrapper>
    );
  }
}

export default Estate;
