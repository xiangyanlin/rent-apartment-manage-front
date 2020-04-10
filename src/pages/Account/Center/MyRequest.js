import React, { PureComponent } from 'react';
import { List, Card, Icon, Dropdown, Menu, Avatar, Tooltip ,Form} from 'antd';
import numeral from 'numeral';
import { connect } from 'dva';
import { formatWan } from '@/utils/utils';
import stylesApplications from '../../List/Applications.less';

@connect(({ vistRequset, loading }) => ({
  vistRequset,
  loading: loading.models.vistRequset,
}))
@Form.create()
class Center extends PureComponent {
  render() {
   

    return (
      <div>我收到的租房请求</div>
    );
  }
}

export default Center;
