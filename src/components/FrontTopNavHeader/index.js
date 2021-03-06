import React, { PureComponent } from 'react';
import Link from 'umi/link';
import RightContent from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import styles from './index.less';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;
export default class FrontTopNavHeader extends PureComponent {
  state = {
    maxWidth: undefined,
  };

  static getDerivedStateFromProps(props) {
    return {
      maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
    };
  }

  render() {
    const { currentUser } = this.props;
    const { theme, contentWidth, logo } = this.props;
    const { maxWidth } = this.state;
    //console.log(this.props)
    return (
      <div className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}>
        <div
          ref={ref => {
            this.maim = ref;
          }}
          className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
        >
          <div className={styles.left}>
            <div className={styles.logo} key="logo" id="logo">
              <Link to="/">
                <img src={logo} alt="logo" />
                <h1>租房管理系统</h1>
              </Link>
            </div>
            <div
              style={{
                maxWidth,
              }}
            >
              <BaseMenu {...this.props} style={{ border: 'none', height: 64 }} />
            </div>
          </div>
          {Object.keys(currentUser).length === 0 ? (
            <div className={styles.goto}>
              <a href="/user/login">登录</a> | <a href="/user/register">注册</a>
            </div>
          ) : (
            <RightContent {...this.props} />
          )}
        </div>
      </div>
    );
  }
}
