import React, { PureComponent } from 'react';
import { connect } from 'dva';
 import { Button, Carousel , Divider } from 'antd';
import moment from 'moment';
import styles from './Details.less';
@connect(({ houseResource, loading }) => ({
  houseResource,
  loading: loading.models.houseResource,
}))
class Details extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const {query}=this.props.location;
    dispatch({
      type: 'houseResource/queryById',
      payload:query
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
    const {  loading} = this.props;
    const {data}=this.props.houseResource;
    //console.log(pic);
    return (
        <div>
         
          <div className={styles.title}> <p>{data.title}</p></div>
          <div className={styles.subtitle}>
            <span>维护时间：{ moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD')}</span><span className={styles.number}>官方投诉电话：13627441292</span>
            
            <p>房源编号：{data.id}</p>
          </div>
         
          <div className={styles.core}>
                 {/* 走马灯 */}
                <div className={styles.thumb}>
                  <Carousel autoplay={true} >
                    {
                    (data.pic?data.pic.split(',').map((value,index) => {
                      return (
                        <div key={index}>
                        <img style={{ width: "100%" ,maxHeight:319, margin:"0 auto" }} src={value}/>
                      </div>
                      );
                      
                    }):data.pic)
                  }
                  </Carousel>
                </div>
                <div className={styles.aside}>
                  <div className={styles.title}>
                    <span style={{fontSize: "40px",fontWight: "700",marginRight: "4px",lineHeight: "56px"}}>{data.rent}</span>
                    元/每月</div>
                  <Divider />
                  <div className={styles.label}>
                    <p>租赁方式：<span>{data.rentMethod==1?"整租":"合租"}</span></p>
                    <p>房屋类型：<span>{data.houseType}</span></p>
                    <p>朝向楼层：<span>{data.orientation}</span></p>
                  </div>
                  <Divider>text</Divider>
                  <div>3</div>
                </div>
          </div>
        </div>
        );
      }
    }
    
    export default Details;
