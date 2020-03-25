import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Input, Button, Icon, Card, Form, Select, Divider,  Popconfirm,message, } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const params = {};

/* eslint react/no-multi-comp:0 */
@connect(({ news, loading }) => ({
  news,
  loading: loading.models.news,
}))
@Form.create()
class News extends PureComponent {
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
      title: '资讯编号',
      dataIndex: 'id',
    },
    {
      title: '资讯标题',
      dataIndex: 'title',
    },
    {
      title: '阅读量',
      dataIndex: 'readNum',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>查看详情</a>
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
      type: 'news/remove',
      payload: { id: rowId },
      callback: res => {
        console.log(res); // 请求完成后返回的结果
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({ type: 'news/fetch' });
        }
      },
    });
  };

  cancel = e => {
    console.log(e);
    message.error('Click on No');
  };
  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetch',
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
      type: 'news/fetch',
      payload: params,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) {
      console.log('没有被选中!');
      return;
    }
    switch (e.key) {
      case 'remove':
        console.log('开始删除!');
        dispatch({
          type: 'news/remove',
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
        type: 'news/fetch',
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
            {getFieldDecorator('keyWord')(<Input placeholder="请输入关键字 如 资讯标题" />)}
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" icon="search">
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
      news: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="资讯列表">
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

export default News;
