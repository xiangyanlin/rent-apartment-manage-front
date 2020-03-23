import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Input,
  Button,
  Icon,
  Card,
  Form,
  Select,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
    const params = {

    };

/* eslint react/no-multi-comp:0 */
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.models.contract,
}))
@Form.create()
class Contract extends PureComponent {
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
      title: '合同编号',
      dataIndex: 'id',
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      render:(text,record,index)=>{
        return this.convertStatus(record);     
      }
    },
    {
      title: '物业地址',
      dataIndex: 'address',
    },
    {
      title: '房源编号',
      dataIndex: 'houseId',
     
    },
    {
      title: '业主姓名',
      dataIndex: 'ownerName'
    },
    {
      title: '客户姓名',
      dataIndex: 'tenantName',
    },
    {
      title: '签约日期',
      dataIndex: 'startTime',
    },
    {
        title: '结束日期',
        dataIndex: 'endTime',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>查看详情</a>
        </Fragment>
      ),
    },
  ];
    // 数字转文
    //状态
  convertStatus=(record)=>{
    if (record.status =='1'){
      return "待签约";
    } 
    else if (record.status=='2'){
      return "履约中";
    } 
    else if (record.status=='3'){
      return "已结束";
    }
    else if (record.status=='4'){
      return "已逾期";
    }          
}

 
  componentDidMount() { //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetch',
      payload: params,
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

    dispatch({
      type: 'contract/fetch',
      payload: params,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'contract/remove',
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
        type: 'contract/fetch',
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
          
          <Col md={8} sm={48}>
            {getFieldDecorator('keyWord')(<Input placeholder="请输入关键字 如 物业地址/业主姓名" />)}
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
    );
  }

  render() {
    const {
      contract: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="合约列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>

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

export default Contract;
