import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Carousel, Divider, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import styles from './Details.less';

const CheckboxGroup = Checkbox.Group;

@connect(({ houseResource, loading }) => ({
  houseResource,
  loading: loading.models.houseResource,
}))
class Details extends PureComponent {
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

  coverTime = time => {
    if (time == '1') {
      return '上午';
    } else if (time == '2') {
      return '中午';
    } else if (time == '3') {
      return '下午';
    } else if (time == '4') {
      return '晚上';
    } else if (time == '5') {
      return '全天';
    } else {
      return '暂无信息';
    }
  };

  render() {
    //console.log(this.props.location.query);
    const { loading } = this.props;
    const { data } = this.props.houseResource;
    //console.log(pic);
    return (
      <div>
        <div>
          <div className={styles.title}>
            {' '}
            <p>{data.title}</p>
          </div>
          <div className={styles.subtitle}>
            <span>
              维护时间：
              {moment(new Date())
                .subtract(1, 'days')
                .format('YYYY-MM-DD')}
            </span>
            <span className={styles.number}>官方投诉电话：13627441292</span>

            <p>
              房源编号：
              {data.id}
            </p>
          </div>

          <div className={styles.core}>
            {/* 走马灯 */}
            <div className={styles.thumb}>
              <Carousel autoplay={true}>
                {data.pic
                  ? data.pic.split(',').map((value, index) => {
                      return (
                        <div key={index}>
                          <img
                            style={{ width: '100%', maxHeight: 319, margin: '0 auto' }}
                            src={'http://127.0.0.1:8080/common/getImage?filename=' + value}
                          />
                        </div>
                      );
                    })
                  : data.pic}
              </Carousel>
            </div>
            <div className={styles.aside}>
              <div className={styles.title}>
                <span
                  style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    marginRight: '4px',
                    lineHeight: '56px',
                  }}
                >
                  {data.rent}
                </span>
                元/每月
              </div>
              <Divider />
              <div className={styles.label}>
                <p>
                  租赁方式：
                  <span>{data.rentMethod == 1 ? '整租' : '合租'}</span>
                </p>
                <p>
                  房屋类型：
                  <span>{data.houseType}</span>
                </p>
                <p>
                  朝&nbsp; &nbsp; 向：
                  <span>{data.orientation}</span>
                </p>
              </div>
              <Divider>text</Divider>
              <div>3</div>
            </div>
          </div>
        </div>
        <Divider />
        <div className={styles.info}>
          <h3 style={{ fontSize: '24px', fontWight: '700' }}>房屋信息</h3>
          <div>
            <span style={{ fontSize: '18px', color: 'rgba(48,48,51,.6)' }}>基本信息</span>
            <div style={{ margin: '20px', float: 'center', fontSize: '17px' }}>
              <Row>
                <Col span={12}>
                  楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;层&nbsp;:&nbsp;
                  {data.floor}
                </Col>
                <Col span={12}>
                  楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号&nbsp;:&nbsp;
                  {data.buildingNum}
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型&nbsp;:&nbsp;
                  {data.houseType}
                </Col>
                <Col span={12}>
                  看房时间&nbsp;:&nbsp;
                  {this.coverTime(data.time)}
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  建筑面积&nbsp;:&nbsp;
                  {data.coveredArea + '平方米'}
                </Col>
                <Col span={12}>
                  使用面积&nbsp;:&nbsp;
                  {data.useArea + '平方米'}
                </Col>
              </Row>
            </div>
          </div>
          <Divider>租房管理系统</Divider>
          <div>
            <span style={{ fontSize: '18px', color: 'rgba(48,48,51,.6)', marginRight: '20px' }}>
              配套设施
            </span>
            <div style={{ marginTop: '20px' }}>
              <CheckboxGroup
                options={[
                  { label: '水', value: '1' },
                  { label: '电', value: '2' },
                  { label: '煤气/天然气', value: '3' },
                  { label: '暖气', value: '4' },
                  { label: '有线电视', value: '5' },
                  { label: '宽带', value: '6' },
                  { label: '电梯', value: '7' },
                  { label: '车位/车库', value: '8' },
                  { label: '地下室/储藏室', value: '9' },
                ]}
                value={data.facilities}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
