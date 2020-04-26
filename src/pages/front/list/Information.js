import React, { PureComponent ,Fragment} from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import {Input,Button, Form, Card, Select, Icon, Avatar, List, Tooltip, Menu } from 'antd';
import { formatWan } from '@/utils/utils';
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

  render() {
    const { list, pagination } = this.props.news.data;
    const {    loading,   form, } = this.props;
    const { getFieldDecorator } = form;
    
    return (
      <div className={styles.filterCardList}>
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
                actions={[
                <Tooltip title="阅读人数">
                  <div><IconText type="read" text={item.readNum} key="list-vertical-star-o" /></div>
                </Tooltip>
                  ,
                  // <Tooltip title="prompt text">
                  //   <span>111</span>
                  // </Tooltip>
                  // <IconText type="message" text="2" key="list-vertical-message" />,
                ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src={item.pic
                      ? 'http://127.0.0.1:8080/common/getImage?filename=' + item.pic.split(',')[0]
                      : item.pic}
                  />
                }
              >

                <List.Item.Meta
                  // avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                 description={item.summary}
                />
                <a>查看详情>>></a>
                {/* {item.content} */}
                
              </List.Item>
              
            )}
          />
           </Card>
      </div>
    );
  }
}

export default FilterCardList;
