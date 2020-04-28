import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {Pagination ,Input, Form, Card, Select, List, Button, Icon, Row,Col,Tag  } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/FrontPageHeaderWrapper';
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
      type: 'question/list',
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
    const { list, pagination } = this.props.question.value;
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
      <PageHeaderWrapper>
      <div className={styles.container}>
        <Row  type="flex" justify='center'>
          <Form layout="inline">
          <FormItem>
          {getFieldDecorator('keyWord')(
            <div style={{ textAlign: 'center' }}>
            <Input.Search
              placeholder="租房知识有疑问？来搜搜吧~"
              enterButton="找答案"
              size="large"
              onSearch={this.handleFormSubmit}
              style={{ width: 522 }}
            />
          </div>
            )}
          </FormItem>
          <FormItem>
          <Button type="primary" size='large'>去提问</Button>
          </FormItem>
          </Form>
         </Row>
        <Card
          title="问答列表"
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
                   <div style={{padding:"0 10%"}}>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={list}
              footer={
                <div>
                  租房管理系统
                </div>
              }
              renderItem={item => (
                <List.Item
                  key={item.questions}
                  actions={[
                      <div>
                          <Tag >
                            <span>{moment(item.quiz_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                          </Tag>
                      </div>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <a
                      onClick={() => {
                        return this.props.history.push('/info/details', { info: item });
                      }}
                    >
                      {item.questions}
                    </a>}
                    description={item.answer}
                  />

                </List.Item>
              )}
            />
             <div className={styles.pagination}>
               <Pagination {...pagination} onChange={this.handleStandardTableChange} />
            </div>
            </div>
        </Card>
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;
