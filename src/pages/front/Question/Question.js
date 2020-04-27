import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {Comment,Input, Form, Card, Select, List, Tag, Icon, Tooltip } from 'antd';

import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import ArticleListContent from '@/components/ArticleListContent';
import styles from './Question.less';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

@connect(({ question, loading }) => ({
  question,
  loading: loading.models.question,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'question/fetch',
    });
  },
})
class SearchList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/fetch',
    });
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  render() {
    const { list, pagination } = this.props.question.data;
    const { form,loading,} = this.props;
    const { getFieldDecorator } = form;

   

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };


    return (
      <Fragment>
        <Card bordered={false}>
          <Form layout="inline">
          <FormItem>
          {getFieldDecorator('keyWord')(
            <div style={{ textAlign: 'center' }}>
            <Input.Search
              placeholder="请输入"
              enterButton="搜索"
              size="large"
              onSearch={this.handleFormSubmit}
              style={{ width: 522 }}
            />
          </div>
            )}
          </FormItem>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <div>问答列表</div>
          <List
            className="comment-list"
            // header={`${data.length} replies`}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <li>
                <Comment
                  actions={item.actions}
                  author={item.author}
                  avatar={item.avatar}
                  content={item.content}
                  datetime={item.datetime}
                />
              </li>
            )}
          />
        </Card>
      </Fragment>
    );
  }
}

export default SearchList;
