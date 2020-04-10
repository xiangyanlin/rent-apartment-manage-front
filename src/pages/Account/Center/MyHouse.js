import React, { PureComponent } from 'react';
import { List, Icon, Tag,Form } from 'antd';
import { connect } from 'dva';
import ArticleListContent from '@/components/ArticleListContent';
import styles from './MyHouse.less';

@connect(({ houseResource, loading }) => ({
  houseResource,
  loading: loading.models.houseResource,
}))
@Form.create()
class Center extends PureComponent {
  render() {
    
    return (
    <div>我的房源</div>
    );
  }
}

export default Center;
