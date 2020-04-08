import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import {  Form,List } from 'antd';
// import { getTimeDistance } from '@/utils/utils';

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
    </font>
  ),
};
@connect(({ loading,user }) => ({
  currentUser:user.currentUser,
  submitting: loading.effects['user/submitRegularForm'],
}))
@Form.create()
class SecurityView extends Component {

   checkStrong=(sValue) =>{
    var modes = 0;
    //正则表达式验证符合要求的
    if (sValue.length < 6) return modes;
    if (/\d/.test(sValue)) modes++; //数字
    if (/[a-z]/.test(sValue)) modes++; //小写
    if (/[A-Z]/.test(sValue)) modes++; //大写  
    if (/\W/.test(sValue)) modes++; //特殊字符
    
   //逻辑处理
    switch (modes) {
        case 1:
            return passwordStrength.weak;
            break;
        case 2:
            return passwordStrength.medium;
        case 3:
            return passwordStrength.medium;
        case 4:
            return sValue.length < 12 ? passwordStrength.medium : passwordStrength.strong
            break;
    }
}
  
  getData = () => {
    const { currentUser } = this.props;
    return[
      {
        title: formatMessage({ id: 'app.settings.security.password' }, {}),
        description: (
          <Fragment>
            {formatMessage({ id: 'app.settings.security.password-description' })}
            {/* {passwordStrength.strong} */}
            {this.checkStrong(currentUser.password)}
          </Fragment>
        ),
        actions: [
          <a href="/admin/account/settings/password">
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
      {
        title: formatMessage({ id: 'app.settings.security.phone' }, {}),
        description: `${formatMessage(
          { id: 'app.settings.security.phone-description' },
          {})}`
          +currentUser.mobile.substr(0,3)+ "****"+currentUser.mobile.substr(7)  ,
        actions: [
          <a href="/admin/account/settings/base">
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
      // {
      //   title: formatMessage({ id: 'app.settings.security.question' }, {}),
      //   description: formatMessage({ id: 'app.settings.security.question-description' }, {}),
      //   actions: [
      //     <a>
      //       <FormattedMessage id="app.settings.security.set" defaultMessage="Set" />
      //     </a>,
      //   ],
      // },
      {
        title: formatMessage({ id: 'app.settings.security.email' }, {}),
        description: `${formatMessage(
          { id: 'app.settings.security.email-description' },
          {}
        )}`+currentUser.email,
        actions: [
          <a href="/admin/account/settings/base">
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
      // {
      //   title: formatMessage({ id: 'app.settings.security.mfa' }, {}),
      //   description: formatMessage({ id: 'app.settings.security.mfa-description' }, {}),
      //   actions: [
      //     <a>
      //       <FormattedMessage id="app.settings.security.bind" defaultMessage="Bind" />
      //     </a>,
      //   ],
      // },
    ];
  }

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
