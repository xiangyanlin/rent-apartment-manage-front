import React, { PureComponent, Fragment } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import { Input, Button, Form, Card, Select, Icon, Avatar, List, Tooltip, Pagination } from 'antd';
import PageHeaderWrapper from '@/components/FrontPageHeaderWrapper';
import styles from './Information.less';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
const { Option } = Select;
const FormItem = Form.Item;

@connect(({ news, loading }) => ({
  news,
  loading: loading.models.news,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'news/fetch',
    });
  },
})
class FilterCardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetch',
    });
  }

  handlePaginationChange = (page, pageSize) => {
    const { dispatch } = this.props;
    // console.log(page,pageSize);
    const params = {
      currentPage: page,
      pageSize: pageSize,
    };

    //
    dispatch({
      type: 'houseResource/fetch',
      payload: params,
    });
  };

  render() {
    const { list, pagination } = this.props.news.data;
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderWrapper>
        <Card
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
                  {/* <b>ant design</b>  */}
                  租房管理系统
                </div>
              }
              renderItem={item => (
                <List.Item
                  key={item.title}
                  actions={[
                    <Tooltip title="阅读人数">
                      <div>
                        <IconText type="read" text={item.readNum} key="list-vertical-star-o" />
                      </div>
                    </Tooltip>,
                    // <Tooltip title="prompt text">
                    //   <span>111</span>
                    // </Tooltip>
                    // <IconText type="message" text="2" key="list-vertical-message" />,
                  ]}
                  extra={
                    <img
                      width={272} height={150}
                      alt="logo"
                      src={
                        item.pic
                          ? 'http://127.0.0.1:8080/common/getImage?filename=' + item.pic.split(',')[0]
                          : item.pic
                      }
                    />
                  }
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.summary}
                  />
                  <a
                    onClick={() => {
                      return this.props.history.push('/info/details', { info: item });
                    }}
                  >
                    查看详情>>>
                  </a>
                  {/* {item.content} */}
                </List.Item>
              )}
            />
             <div className={styles.pagination}>
               <Pagination {...pagination} onChange={this.handleStandardTableChange} />
            </div>
            </div>
           
        </Card>
        </PageHeaderWrapper>
    );
  }
}

export default FilterCardList;
