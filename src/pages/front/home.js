import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Carousel, Divider, Checkbox, Row, Col } from 'antd';
import Header from '../../layouts/FrontHeader'
import styles from './home.less';
import house from '../../assets/house-things-1.png'

@connect(({ loading, user, project }) => ({
    currentUser: user.currentUser,
    currentUserLoading: loading.effects['user/fetchCurrent'],
  }))
class Home extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { query } = this.props.location;
    dispatch({
      type: 'houseResource/queryById',
      payload: query,
    });
  }

  reload() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/queryById',
      // type: 'rule/fetch',
    });
  }



  render() {
    //console.log(this.props.location.query);
    const { match, children, location } = this.props;

    return (
    
          <div >
              {/* <Header></Header> */}
              <div className={styles.head} data-stellar-background-ratio="0.07">
              <div style={{float:"right",marginRight:"20px"}}>
                  <a href="/list/search/projects">租房</a>
                  <a href="/list/search/information">资讯</a>
                  <a>问答</a>
              </div>
              <div className={styles.title}>
                  <span>租房管理系统</span>
              </div>

              </div>
              <div className={styles.buttom}>
                  <div style={{width:"20%",float:"left"}}>
                  <a href="/list/search/projects">
                      <img src={house}/>
                      <span>去租房</span>
                  </a>
                  </div>
              </div>
        </div>

  
      
    );
  }
}

export default Home;
