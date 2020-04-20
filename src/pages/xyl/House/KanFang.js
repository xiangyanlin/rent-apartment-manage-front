import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Divider ,  Popconfirm,message,Button} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditKanFang from './EditKanFang';
import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ vistRequset, loading }) => ({
  vistRequset,
  loading: loading.models.vistRequset,
}))
@Form.create()
class KanFang extends PureComponent {
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
      dataIndex: 'tenantName',
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
        <EditKanFang record={record} reload={this.reload.bind(this)} />
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
      type: 'vistRequset/delete',
      payload: { id: rowId },
      callback: res => {
        console.log(res); // 请求完成后返回的结果
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({ type: 'vistRequset/requestList' });
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
      return '带看房';
    } else if (record.status == '4') {
      return '已取消';
    }else if (record.status == '5') {
      return '已拒绝';
    }
  };

  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'vistRequset/requestList',
    });
  }
  reload() {
    const { dispatch } = this.props;
    dispatch({
      type: 'vistRequset/requestList',
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
      type: 'vistRequset/fetch',
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
          type: 'vistRequset/remove',
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
      vistRequset: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="看房请求">
        <Card bordered={false}>
          <div className={styles.tableList}>
          {/* <Button type="primary" icon="plus" onClick={this.handleOnClick}>新增</Button> */}
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

export default KanFang;
