import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';
import styles from './Monitor.less';

const { Secured } = Authorized;

const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 300);
});

@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
class Monitor extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetch',
    });
  }
  getSysFile = () => {
    const { monitor, loading } = this.props;
    const { server } = monitor;
    console.log(server.sysFiles)
    if (Array.isArray(server.sysFiles)) {
      return server.sysFiles.reduce((pre, item) => {
        pre.push((
          <tr key={item.dirName}>
            <td><div className={styles.cell}>{item.dirName}</div></td>
            <td><div className={styles.cell}>{item.sysTypeName}</div></td>
            <td><div className={styles.cell}>{item.typeName}</div></td>
            <td><div className={styles.cell}>{item.total}</div></td>
            <td><div className={styles.cell}>{item.free}</div></td>
            <td><div className={styles.cell}>{item.used}</div></td>
            <td><div className={styles.cell} className="{'text-danger': sysFile.usage > 80}">{item.usage}%</div></td>
          </tr>
        ))
        return pre
      }, [])

    }
  }
  render() {
    const { monitor, loading } = this.props;
    const { server } = monitor;
    return (


      <div className={styles.app}>
        {server.cpu ? (<Row>
          <Col span={12} className={styles.card}>
            <Card
              title='CPU'>
              <div className="el-table el-table--enable-row-hover el-table--medium">
                <table cellSpacing={0}  style={{ width: ' 100%' }} >
                  <thead>
                    <tr>
                      <th className={styles.isLeaf}><div className={styles.cell}>属性</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>值</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><div className={styles.cell}>核心数</div></td>
                      <td><div className={styles.cell} >{server.cpu.cpuNum}</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>用户使用率</div></td>
                      <td><div className={styles.cell} >{server.cpu.used}%</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>系统使用率</div></td>
                      <td><div className={styles.cell} >{server.cpu.sys}%</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>当前空闲率</div></td>
                      <td><div className={styles.cell} >{server.cpu.free}%</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>

          <Col span={12} className={styles.card}
          >
            <Card title='内存'>
              <div className="el-table el-table--enable-row-hover el-table--medium">
                <table cellSpacing={0} cellSpacing={0} style={{ width: ' 100%' }}>
                  <thead>
                    <tr>
                      <th className={styles.isLeaf}><div className={styles.cell}>属性</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>内存</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>JVM</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><div className={styles.cell}>总内存</div></td>
                      <td><div className={styles.cell} >{server.mem.total}G</div></td>
                      <td><div className={styles.cell}>{server.jvm.total}M</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>已用内存</div></td>
                      <td><div className={styles.cell}>{server.mem.used}G</div></td>
                      <td><div className={styles.cell}>{server.jvm.used}M</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>剩余内存</div></td>
                      <td><div className={styles.cell}>{server.mem.free}G</div></td>
                      <td><div className={styles.cell} >{server.jvm.free}M</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>使用率</div></td>
                      <td><div className={styles.cell} >{server.mem.usage}%</div></td>
                      <td><div className={styles.cell} >{server.jvm.usage}%</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>

          <Col span={24} className={styles.card}>
            <Card title='服务器信息'>
              <div className="el-table el-table--enable-row-hover el-table--medium">
                <table cellSpacing={0} style={{ width: ' 100%' }}>
                  <tbody>
                    <tr>
                      <td><div className={styles.cell}>服务器名称</div></td>
                      <td><div className={styles.cell} >{server.sys.computerName}</div></td>
                      <td><div className={styles.cell}>操作系统</div></td>
                      <td><div className={styles.cell} >{server.sys.osName}</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>服务器IP</div></td>
                      <td><div className={styles.cell} >{server.sys.computerIp}</div></td>
                      <td><div className={styles.cell}>系统架构</div></td>
                      <td><div className={styles.cell} >{server.sys.osArch}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>

          <Col span={24} className={styles.card}>
            <Card title='Java虚拟机信息'>
              <div className="el-table el-table--enable-row-hover el-table--medium">
                <table cellSpacing={0} style={{ width: ' 100%' }}>
                  <tbody>
                    <tr>
                      <td><div className={styles.cell}>Java名称</div></td>
                      <td><div className={styles.cell}>{server.jvm.name}</div></td>
                      <td><div className={styles.cell}>Java版本</div></td>
                      <td><div className={styles.cell} >{server.jvm.version}</div></td>
                    </tr>
                    <tr>
                      <td><div className={styles.cell}>启动时间</div></td>
                      <td><div className={styles.cell} >{server.jvm.startTime}</div></td>
                      <td><div className={styles.cell}>运行时长</div></td>
                      <td><div className={styles.cell} >{server.jvm.runTime}</div></td>
                    </tr>
                    <tr>
                      <td ><div className={styles.cell}colSpan={1}>安装路径</div></td>
                      <td><div className={styles.cell}colSpan={3}>{server.jvm.home}</div></td>
                    </tr>
                    <tr>
                      <td ><div className={styles.cell} colSpan={1}>项目路径</div></td>
                      <td><div className={styles.cell} colSpan={3}>{server.sys.userDir}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>

          <Col span={24} className={styles.card}>
            <Card title="磁盘状态">
              <div className="el-table el-table--enable-row-hover el-table--medium">
                <table cellSpacing={0} style={{ width: ' 100%' }}>
                  <thead>
                    <tr>
                      <th className={styles.isLeaf}><div className={styles.cell}>盘符路径</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>文件系统</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>盘符类型</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>总大小</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>可用大小</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>已用大小</div></th>
                      <th className={styles.isLeaf}><div className={styles.cell}>已用百分比</div></th>
                    </tr>
                  </thead>
                  <tbody >
                    {this.getSysFile()}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>
        </Row>) : ("")}
        {/* */}
      </div>
    );
  }
}

export default Monitor;
