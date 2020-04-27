import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/FrontPageHeaderWrapper';

@connect()
class SearchList extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      case 'information':
        router.push(`${match.url}/information`);
        break;
      case 'question':
        router.push(`${match.url}/question`);
        break;

      default:
        break;
    }
  };

  handleFormSubmit = value => {
    // eslint-disable-next-line
    console.log(value);
  };

  render() {
    const tabList = [
      {
        key: 'projects',
        tab: '出租',
      },
      {
        key: 'information',
        tab: '资讯',
      },
      {
        key: 'question',
        tab: '问答',
      },
    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;
