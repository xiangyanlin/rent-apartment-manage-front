import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';


const { RangePicker } = DatePicker;

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {rangePickerValue}=this.state;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
    dispatch({
      type: 'chart/fetchUserTotal',
    });
    dispatch({
      type: 'chart/fetchHouseTotal',
    });
    dispatch({
      type: 'chart/fetchEstateTotal',
    });
    dispatch({
      type: 'chart/fetchDecorationProp',
    });
    dispatch({
      type: 'chart/countUserByMon',
      payload:{
        startTime:rangePickerValue[0]._i,
        endTime:rangePickerValue[1]._i,
      }
    });
    dispatch({
      type: 'chart/counHouseByO',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    // debugger
    this.setState({
      rangePickerValue,
    });
    console.log(rangePickerValue)
    dispatch({
      type: 'chart/countUserByMon',
      payload:{
        startTime:rangePickerValue[0].format("YYYY-MM-DD HH:mm:ss"),
        endTime:rangePickerValue[1].format("YYYY-MM-DD HH:mm:ss"),
      }
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };



  render() {
    
    const {
      userTotal,
      houseTotal,
      estateTotal,
      decorationProp,
      userNumbyTime,
      countHouseByO,
    } = this.props.chart;
    const { rangePickerValue, salesType, loading: propsLoding, currentTabKey } = this.state;
    console.log(rangePickerValue[0]._i);
    const { chart, loading: stateLoading } = this.props;
    const {
      salesData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    const loading = propsLoding || stateLoading;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <GridContent>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="用户总量"
              loading={loading}
              action={
                <Tooltip title="本系统注册用户总数">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(userTotal).format('0,0')}
              contentHeight={46}
              style={{ height: '180px' }}
            >
              <Icon type="contacts" theme="twoTone" style={{ fontSize: '90px', float: 'right' }} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title="房源总量"
              action={
                <Tooltip title="登记房源总数">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(houseTotal).format('0,0')}
              contentHeight={46}
              style={{ height: '180px' }}
            >
              <Icon type="home" theme="twoTone" style={{ fontSize: '85px', float: 'right' }} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title="楼盘总量"
              action={
                <Tooltip title="系统录入楼盘总量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(estateTotal).format('0,0')}
              contentHeight={46}
              style={{ height: '180px' }}
            >
              <Icon type="bank" theme="twoTone" style={{ fontSize: '85px', float: 'right' }} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title="精装房源占比"
              action={
                <Tooltip title="精装房源占房源总量的比例">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={decorationProp + '%'}
              contentHeight={46}
              style={{ height: '180px' }}
            >
              <MiniProgress percent={decorationProp} strokeWidth={8} target={80} color="#13C2C2" />
            </ChartCard>
          </Col>
        </Row>

        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{ padding: 0 }}
          title="新增用户数量图"
          extra={
            <RangePicker
              defaultValue={rangePickerValue}
              onChange={this.handleRangePickerChange}
              style={{ width: 256 }}
            />
          }
        >
          <div className={styles.salesCard}>
            <Row>
              <Col>
                <div className={styles.salesBar}>
                  <Bar height={295} data={userNumbyTime} />
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <Row gutter={24}>
          <Col>
            <Card
              loading={loading}
              className={styles.salesCard}
              bordered={false}
              title="房源朝向占比"
              bodyStyle={{ padding: 24 }}
              style={{ marginTop: 24, minHeight: 509 }}
            >
              <Pie
                hasLegend
                subTitle="房源数量"
                total={countHouseByO.reduce((pre, now) => now.y + pre, 0)}
                data={countHouseByO}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>

        {/* <Card
          title="用户数量变化趋势"
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
         
                <div style={{ padding: '0 24px' }}>
                  <TimelineChart
                    height={400}
                    data={userNumbyTime}
                    titleMap={{y1: "用户数量"}}
                  />
                </div>
        </Card> */}
      </GridContent>
    );
  }
}

export default Analysis;
