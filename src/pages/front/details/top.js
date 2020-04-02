import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/FrontPageHeaderWrapper';

@connect()
class Top extends Component {
  

  handleFormSubmit = (value) => {
    // eslint-disable-next-line
    console.log(value);
  }

  render() {




    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        // title="搜索列表"
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
        {/* <Switch>
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch> */}
      </PageHeaderWrapper>
    );
  }
}

export default Top;
