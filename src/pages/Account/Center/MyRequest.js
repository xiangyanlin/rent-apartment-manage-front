import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from '../../xyl/TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ user,vistRequset, loading }) => ({
  currentUser:user.currentUser,
  vistRequset,
  loading: loading.models.vistRequset,
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
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '租客姓名',
      dataIndex: 'tenant_name',
    },
    {
      title: '租客电话',
      dataIndex: 'mobile',
    },
    {
      title: '项目/小区',
      dataIndex: 'estateName',
    },
    {
      title: '请求时间',
      dataIndex: 'requestTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '看房时间',
      dataIndex: 'vistTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '请求状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return this.convertStatus(record);
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>同意看房</a>
          <Divider type="vertical" />
          <a href="">拒绝看房</a>
        </Fragment>
      ),
    },
  ];
  convertStatus = record => {
    if (record.status == '1') {
      return '已确认';
    } else if (record.status == '2') {
      return '待确认';
    } else if (record.status == '3') {
      return '带看房';
    } else if (record.status == '4') {
      return '已取消';
    }
  };

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { currentUser,dispatch } = this.props;
    dispatch({
      type: 'vistRequset/requestList',
      payload:{  ownerId:currentUser.id,}
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { currentUser,dispatch } = this.props;
    const { formValues } = this.state;

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

    dispatch({
      type: 'vistRequset/fetch',
      payload: params,
    });
  };

  handleMenuClick = e => {
    const { currentUser,dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'vistRequset/remove',
          payload: {
            key: selectedRows.map(row => row.key),
            ownerId:currentUser.id,

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
      vistRequset: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
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
