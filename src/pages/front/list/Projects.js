import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, List, Pagination } from 'antd';
import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import styles from './Projects.less';
const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({ houseResource, loading }) => ({
  houseResource,
  loading: loading.models.houseResource,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'houseResource/fetch',
      // payload: {
      //   count: 8,
      // },
    });
  },
})
class CoverCardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      // payload: {
      //   count: 8,
      // },
    });
  }

  reload() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      // type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (page, pageSize) => {
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
    const { list, pagination } = this.props.houseResource.data;
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    //console.log( list);
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const cardList = list ? (
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <img
                  alt={item.title}
                  src={
                    item.pic
                      ? 'http://127.0.0.1:8080/common/getImage?filename=' + item.pic.split(',')[0]
                      : item.pic
                  }
                  width="147px"
                  height="110px"
                />
              }
              title={
                <div style={{ fontSize: '20px' }}>
                  <a style={{ color: 'black' }} href={'/details/house?id=' + item.id}>
                    {item.title}
                  </a>
                </div>
              }
              description={
                <div>
                  <div>
                    <span>{item.houseType}</span>
                    <span>
                      {item.coveredArea}
                      m²
                    </span>
                  </div>
                  <span>{item.houseDesc}</span>
                </div>
              }
            />
            <div className={styles.rent}>
              {item.rent}
              元/月
            </div>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect expandable>
                    <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                    <TagSelect.Option value="cat2">类目二</TagSelect.Option>
                    <TagSelect.Option value="cat3">类目三</TagSelect.Option>
                    <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                    <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                    <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                    <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                    <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                    <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                    <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                    <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                    <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="作者">
                    {getFieldDecorator('author', {})(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="lisa">王昭君</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="好评度">
                    {getFieldDecorator('rate', {})(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="good">优秀</Option>
                        <Option value="normal">普通</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <div className={styles.cardList}>{cardList}</div>
        <div className={styles.pagination}>
          <Pagination {...pagination} onChange={this.handleStandardTableChange} />
        </div>
      </div>
    );
  }
}

export default CoverCardList;
