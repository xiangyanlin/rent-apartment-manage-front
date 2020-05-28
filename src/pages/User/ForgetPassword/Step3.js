import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ form }) => ({
  // data: form.step,
}))
class Step3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      router.push('/user/login');
    };
 
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          去登录
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="修改成功"
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
