import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Popconfirm, Divider, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Zufang from "./EditZufang"
import styles from '../TableList.less';
import EditZufang from './EditZufang';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ zufang, loading }) => ({
  zufang,
  loading: loading.models.zufang,
}))
@Form.create()
class ZuFang extends PureComponent {
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
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '房源名称',
      dataIndex: 'houseName',
    },
    {
      title: '租客姓名',
      dataIndex: 'tenanName',
    },
    {
      title: '租客手机',
      dataIndex: 'mobile',
    },
    {
      title: '合同起止时间',
      render: (text, record, index) => {
        return record.startTime + '至' + record.endTime;
      },
    },
    {
      title: '租金',
      dataIndex: 'rent',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return this.convertStatus(record);
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Zufang record={record} reload={this.reload.bind(this)} type="edit" />
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

  confirm = (rowId, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'zufang/remove',
      payload: { id: rowId },
      callback: res => {
        console.log(res); 
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({ type: 'zufang/fetch' });
        }
      },
    });
  };

  convertStatus = record => {
    if (record.status == '1') {
      return '已确认';
    } else if (record.status == '2') {
      return '待确认';
    } else if (record.status == '3') {
      return '待付款';
    }
  };

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'zufang/fetch',
    });
  }

  reload (){
    const { dispatch } = this.props;
    dispatch({
      type: 'zufang/fetch',
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
      type: 'zufang/fetch',
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
          type: 'zufang/remove',
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

  render() {
    const {
      zufang: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="租房管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
          <EditZufang record={{}} reload={this.reload.bind(this)} type="add"/>
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

export default ZuFang;
