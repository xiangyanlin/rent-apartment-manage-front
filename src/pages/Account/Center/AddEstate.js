import React, { PureComponent } from 'react';
import { List, Card ,Form} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import AvatarList from '@/components/AvatarList';
import stylesProjects from '../../List/Projects.less';

@connect(
  ({ loading,estate}) => ({
    estate,
    loading: loading.models.estate,
}))
@Form.create()
class Center extends PureComponent {
  render() {

    return (
     <div>新增楼盘</div>
    );
  }
}

export default Center;
