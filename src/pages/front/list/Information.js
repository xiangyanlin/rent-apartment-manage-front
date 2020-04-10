import React, { PureComponent ,Fragment} from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import {Input,Button, Form, Card, Select, Icon, Avatar, List, Dropdown, Menu } from 'antd';
import { formatWan } from '@/utils/utils';
import styles from './Information.less';


const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
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

  render() {
    const { list, pagination } = this.props.news.data;
    const {    loading,   form, } = this.props;
    const { getFieldDecorator } = form;
    
    return (
      <div className={styles.filterCardList}>
                <Card bordered={false} style={{marginBottom:"5px"}}>
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
                hoverable
                bodyStyle={{ paddingBottom: 20 }}
              >
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3,
            }}
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
                // actions={[
                //   <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                //   <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                //   <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                // ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }
              >

                <List.Item.Meta
                  // avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  // description={item.description}
                />
                {item.content}
                
              </List.Item>
              
            )}
          />
           </Card>
      </div>
    );
  }
}

export default FilterCardList;
