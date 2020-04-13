import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import avatar from '../../../assets/avatar.png';
@connect(({ loading, user, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {
        userName: window.localStorage.getItem('currentUser'),
      },
    });
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'myHouse':
        router.push(`${match.url}/myHouse`);
        break;
      case 'myRequest':
        router.push(`${match.url}/myRequest`);
        break;
      case 'addResource':
        router.push(`${match.url}/addResource`);
        break;
      case 'addEstate':
        router.push(`${match.url}/addEstate`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

    // 数字转文字
  //性别
  convertSex=(sex)=>{
    if (sex =='0'){
      return "未知";
    } 
    else if (sex=='1'){
      return "男";
    } 
    else if (sex=='2'){
      return "女";
    }  
  }  
  covertProfession=(profession)=>{
    if (profession =='1'){
      return "大专以下";
    } 
    else if (profession=='2'){
      return "大专";
    } 
    else if (profession=='3'){
      return "本科";
    }  else if (profession=='4'){
      return "研究生";
    } else if (profession=='5'){
      return "研究生以上";
    } 
  }

  render() {
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
      match,
      location,
      children,
    } = this.props;

    const operationTabList = [
      {
        key: 'myHouse',
        tab: (
          <span>
            我的房源 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
      {
        key: 'myRequest',
        tab: (
          <span>
            看房请求 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
      {
        key: 'addResource',
        tab: (
          <span>
            发布房源 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
      {
        key: 'addEstate',
        tab: (
          <span>
            新增楼盘 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <Avatar size={80} src={currentUser.avatar?"http://127.0.0.1:8080/common/getImage?filename="+currentUser.avatar:avatar} />
                    <div className={styles.name}>{currentUser.userName}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  <div >
                    <p>
                      <Icon type="message" />
                      基本信息
                    </p>
                    <p>
                      <Icon type="usergroup-delete" />
                       性别：{this.convertSex(currentUser.sex)}
                    </p>
                    <p>
                      <Icon type="bulb" />
                      学历：{this.covertProfession(currentUser.education)}
                      </p>
                      <p>
                      <Icon type="robot" />
                      职业：{currentUser.profession}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>
                    <Icon type="safety" />
                      安全信息
                    </div>
                    
                    <p>
                    <Icon type="notification" />
                       邮箱：{currentUser.email}
                    </p>
                    <p>
                    <Icon type="mobile" />
                      手机：{currentUser.mobile}
                      </p>
                      <p>
                      <Icon type="barcode" />
                      真名：{currentUser.realName}
                    </p>
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>可在个人设置出修改个人信息</div>
                    
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            {currentUser.role!="2"?
            <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={location.pathname.replace(`${match.path}/`, '')}
            onTabChange={this.onTabChange}
            loading={listLoading}
          >
            {children}
          </Card>
          :<div>成为房东</div>}
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
