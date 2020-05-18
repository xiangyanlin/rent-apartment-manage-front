import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Card,
  Select,
  List,
  Pagination,
  Input,
  Button,
  Icon,
  Radio,
  Checkbox,
  Divider,
} from 'antd';
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
    // 模拟查询表单生效
    dispatch({
      type: 'houseResource/fetch',
      payload: {
        ...allValues,
      },
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

  handleFormSubmit = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      payload: { keyWord: value },
    });
  };
  //重置
  handleFormReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      payload: {},
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
        <FormItem label="方式">
          {getFieldDecorator('rentMethod')(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="">不限</Radio.Button>
              <Radio.Button value="1">整租</Radio.Button>
              <Radio.Button value="2">合租</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="租金">
          <Row style={{ width: '30%' }}>
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
        </FormItem>
        <FormItem label="户型">
          {getFieldDecorator('houseType')(
            <Checkbox.Group
              options={[
                { label: '1室', value: '1室' },
                { label: '2室', value: '2室' },
                { label: '3室', value: '3室' },
                { label: '4室', value: '4室' },
              ]}
            />
          )}
        </FormItem>
        <Row label="">
          <Divider>
            <a style={{}} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </Divider>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <FormItem label="方式">
          {getFieldDecorator('rentMethod')(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="">不限</Radio.Button>
              <Radio.Button value="1">整租</Radio.Button>
              <Radio.Button value="2">合租</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="租金">
          <Row style={{ width: '30%' }}>
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
        </FormItem>
        <FormItem label="户型">
          {getFieldDecorator('houseType')(
            <Checkbox.Group
              options={[
                { label: '1室', value: '1室' },
                { label: '2室', value: '2室' },
                { label: '3室', value: '3室' },
                { label: '4室', value: '4室' },
              ]}
            />
          )}
        </FormItem>
        <FormItem label="朝向">
          {getFieldDecorator('orientation')(
            <Checkbox.Group
              options={[
                { label: '东', value: '东' },
                { label: '南', value: '南' },
                { label: '西', value: '西' },
                { label: '北', value: '北' },
              ]}
            />
          )}
        </FormItem>

        <FormItem label="支付方式">
          {getFieldDecorator('paymentMethod')(
            <Checkbox.Group
              options={[
                { label: '付一押一', value: '1' },
                { label: '付三押一', value: '2' },
                { label: '付六押一', value: '3' },
                { label: '年付押一', value: '4' },
              ]}
            />
          )}
        </FormItem>
        <FormItem label="看房时间">
          {getFieldDecorator('time')(
            <Checkbox.Group
              options={[
                { label: '上午', value: '1' },
                { label: '中午', value: '2' },
                { label: '下午', value: '3' },
                { label: '晚上', value: '4' },
                { label: '全天', value: '5' },
              ]}
            />
          )}
        </FormItem>
        <FormItem label="装修">
          {getFieldDecorator('decoration')(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="">不限</Radio.Button>
              <Radio.Button value="1">精装</Radio.Button>
              <Radio.Button value="2">简装</Radio.Button>
              <Radio.Button value="3">毛坯</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <Row>
          <Divider style={{}}>
            <a style={{}} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </Divider>
        </Row>
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
                  <a
                    style={{ color: 'black' }}
                    onClick={() => {
                      return this.props.history.push('/house/details', { house: item });
                    }}
                  >
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
        <div style={{ margin: '10px 0 20px 30px' }}>
          <Input.Search
            placeholder="开始找房"
            size="large"
            onSearch={this.handleFormSubmit}
            style={{ width: 522 }}
          />
          <Button
            size="large"
            type="dashed"
            style={{ marginLeft: 8 }}
            onClick={this.handleFormReset}
          >
            重置
          </Button>
        </div>
        <Card
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: '80%' }}>
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
