import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Input, Button, Icon, Card, Form, Select, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const params = {};

/* eslint react/no-multi-comp:0 */
@connect(({ owner, loading }) => ({
  owner,
  loading: loading.models.owner,
}))
@Form.create()
class User extends PureComponent {
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
      title: '房东编号',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (text, record, index) => {
        return this.convertSex(record);
      },
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '职业信息',
      dataIndex: 'profession',
    },
    {
      title: '学历',
      dataIndex: 'education',
      render: (text, record, index) => {
        return this.convertEaducation(record);
      },
    },
    {
      title: '是否认证',
      dataIndex: 'identify',
      render: (text, record, index) => {
        return this.convertIdentify(record);
      },
    },
    {
      title: '是否房东',
      dataIndex: 'role',
      render: (text, record, index) => {
        return this.convertOwner(record);
      },
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
  // 数字转文字
  //性别
  convertSex = record => {
    if (record.sex == '0') {
      return '未知';
    } else if (record.sex == '1') {
      return '男';
    } else if (record.sex == '2') {
      return '女';
    }
  };
  //认证
  convertIdentify = record => {
    if (record.identify == '0') {
      return '未认证';
    } else if (record.identify == '1') {
      return '已认证';
    }
  };
  //是否房东
  convertOwner = record => {
    if (record.Id == 3) {
      return '是';
    } else {
      return '否';
    }
  };
  //学历
  convertEaducation = record => {
    if (record.education == '1') {
      return '专科以下';
    } else if (record.education == '2') {
      return '专科';
    } else if (record.education == '3') {
      return '本科';
    } else if (record.education == '4') {
      return '研究生';
    } else if (record.education == '5') {
      return '研究生以上';
    }
  };
  componentDidMount() {
    //当组件挂载完成后执行加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'owner/fetch',
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
      type: 'owner/fetch',
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
          type: 'owner/remove',
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
        type: 'owner/fetch',
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
            {getFieldDecorator('keyWord')(
              <Input placeholder="请输入关键字 如 姓名/手机号/身份证号" />
            )}
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
      owner: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="用户列表">
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

export default User;
