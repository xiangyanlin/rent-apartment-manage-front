import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';


class Workplace extends PureComponent {
 
  render() {
  
    return (
      <PageHeaderWrapper
      >
        <Card
        >
          
      <iframe
        title="resg"
        src="http://127.0.0.1:8080/druid/index.html"
        style={{ width: '100%', border: '0px', height: '1100px' }}
        scrolling="auto"
      />
        </Card>     
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
