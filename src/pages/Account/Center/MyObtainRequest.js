import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Divider ,message} from 'antd';
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
  submitting: loading.effects['vistRequset/updateVistRequestForm'],
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
      dataIndex: 'request_time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '看房时间',
      dataIndex: 'vist_time',
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
        record.status=="2"?
        <Fragment>
          <a onClick={() => this.handleAgree(record.id)}>同意看房</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleRefuse(record.id)}>拒绝看房</a>
        </Fragment>
        :<span>无</span>
      ),
    },
  ];
  convertStatus = record => {
    if (record.status == '1') {
      return '已确认';
    } else if (record.status == '2') {
      return '待确认';
    } else if (record.status == '3') {
      return '待看房';
    } else if (record.status == '4') {
      return '已取消';
    }else if (record.status == '5') {
      return '已拒绝';
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
  reload() {
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
  }

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

  handleAgree = (rowId) => {
    const { dispatch } = this.props;
    const values={};
    values.id=rowId;
    // 待看房
    values.status = "3";

    dispatch({
          type: 'vistRequset/updateVistRequestForm',
          payload: values,
          callback: res => {
            console.log(res); // 请求完成后返回的结果
            if (res.code == 200) {
              message.success('已同意看房');
              this.reload();
            }
          },
      });
};
  handleRefuse= (rowId) => {
    const { dispatch } = this.props;
    const values={};
    values.id=rowId;
    // 已拒绝
    values.status = "5";

    dispatch({
          type: 'vistRequset/updateVistRequestForm',
          payload: values,
          callback: res => {
            console.log(res); // 请求完成后返回的结果
            if (res.code == 200) {
              message.success('已同意看房');
              this.reload();
            }
          },
      });
  };


handleAgree = (rowId) => {
  const { dispatch } = this.props;
  const values={};
  values.id=rowId;
  // 待看房
  values.status = "3";

  dispatch({
        type: 'vistRequset/updateVistRequestForm',
        payload: values,
        callback: res => {
          console.log(res); // 请求完成后返回的结果
          if (res.code == 200) {
            message.success('已同意看房');
            this.reload();
          }
        },
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
