import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, List, Pagination,Input,Button,Icon } from 'antd';
import PageHeaderWrapper from '@/components/FrontPageHeaderWrapper';
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
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
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
        type: 'houseResource/fetch',
        payload: values,
      });
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 5, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            {getFieldDecorator('status')(
              <Select placeholder="房屋状态" style={{ width: '100%' }}>
                <Option value="1">待租</Option>
                <Option value="2">租出</Option>
              </Select>
            )}
          </Col>
          <Col md={4} sm={24}>
            {getFieldDecorator('title')(<Input placeholder="楼盘名称" />)}
          </Col>
          <Col md={4} sm={24}>
            {getFieldDecorator('used')(
              <Select placeholder="房屋类型" style={{ width: '100%' }}>
                <Option value="1">住宅</Option>
                <Option value="2">商住两用</Option>
              </Select>
            )}
          </Col>
          <Col md={4} sm={24}>
            {getFieldDecorator('houseType')(<Input placeholder="户型" />)}
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('status')(
                <Select placeholder="房屋状态" style={{ width: '100%' }}>
                  <Option value="0">待租</Option>
                  <Option value="1">租出</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('title')(<Input placeholder="楼盘名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('used')(
                <Select placeholder="房屋类型" style={{ width: '100%' }}>
                  <Option value="0">住宅</Option>
                  <Option value="1">商住两用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('houseType')(<Input placeholder="户型" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('id')(<Input placeholder="房源编号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <Row>
              <Col md={10} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('minRent')(<Input placeholder="价格" />)}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <div style={{ textAlign: 'center' }}>到</div>
              </Col>
              <Col md={10} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('maxRent')(<Input placeholder="价格" />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orientation')(<Input placeholder="朝向" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {/* {getFieldDecorator('name')(<Input placeholder="装修" />)} */}
              {getFieldDecorator('decoration')(
                <Select placeholder="装修" style={{ width: '100%' }}>
                  <Option value="1">精装</Option>
                  <Option value="2">简装</Option>
                  <Option value="3">毛坯</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
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
                  <a style={{ color: 'black' }} href={'/house/details?id=' + item.id}>
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
      <PageHeaderWrapper>
      <Card 
                bordered={false}
                bodyStyle={{ padding: '8px 32px 32px 32px' ,display:"flex",justifyContent:"center"}}
      >
      <div style={{width:"80%"}}>

          <Form layout="inline" onSubmit={this.handleSearch}>
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
          <div className={styles.tableListForm}>{this.renderForm()}</div>
       

        <div className={styles.cardList}>{cardList}</div>
      
        <div className={styles.pagination}>
          <Pagination {...pagination} onChange={this.handleStandardTableChange} />
        </div>
      </div>
      </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CoverCardList;
