import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Input,
  Button,
  Tag,
  Card,
  Form,
  Select,
  Divider,
  Popconfirm,
  message,
  Popover,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Answer from './Answer';
import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const params = {};

/* eslint react/no-multi-comp:0 */
@connect(({ question, user, loading }) => ({
  question,
  currentUser: user.currentUser,
  loading: loading.models.question,
}))
@Form.create()
class Question extends PureComponent {
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
      title: '问答编号',
      dataIndex: 'id',
    },
    {
      title: '所提问题',
      dataIndex: 'questions',
      render: (text, record) => (
        <Popover content={record.questions} title="问题" overlayStyle={{ width: '40%' }}>
          <Button type="dashed">查看</Button>
        </Popover>
      ),
    },
    {
      title: '提问描述',
      dataIndex: 'summary',
      render: (text, record) => (
        <Popover
          content={record.summary ? record.summary : '暂无描述'}
          title="描述"
          overlayStyle={{ width: '40%' }}
        >
          <Button type="dashed">查看</Button>
        </Popover>
      ),
    },
    {
      title: '回答',
      dataIndex: 'answer',
      render: (text, record) => (
        <Popover
          content={record.answer ? record.answer : '暂无回答'}
          title="回答"
          overlayStyle={{ width: '40%' }}
        >
          <Button type="dashed">查看</Button>
        </Popover>
      ),
    },
    {
      title: '提问者',
      dataIndex: 'questioner',
    },
    {
      title: '回答者',
      dataIndex: 'answerer',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return this.covertStatus(record.status);
      },
    },
    {
      title: '提问时间',
      dataIndex: 'quiz_time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '回答时间',
      dataIndex: 'answer_time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Answer record={record} reload={this.reload.bind(this)} />
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
    //console.log(e);
    const { dispatch } = this.props;
    //console.log(rowId);
    dispatch({
      type: 'question/remove',
      payload: { id: rowId },
      callback: res => {
        // console.log(res); // 请求完成后返回的结果
        if (res.code == 200) {
          message.success('删除成功');
          dispatch({ type: 'question/fetch' });
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
      type: 'question/list',
      // payload: {status:2},
    });
  }

  reload() {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/list',
      // payload: {status:2},
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
      type: 'question/list',
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
          type: 'question/remove',
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
        type: 'question/fetch',
        payload: values,
      });
    });
  };

  covertStatus = status => {
    if (status == '1') {
      return '待回答';
    } else if (status == '2') {
      return '以回答';
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 5, lg: 24, xl: 48 }}>
          <Col md={8} sm={48}>
            {getFieldDecorator('keyWord')(<Input placeholder="请输入关键字 如 租房" />)}
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
      question: { value },
      loading,
    } = this.props;
    console.log(this.props);
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper title="问答列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={value}
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

export default Question;
