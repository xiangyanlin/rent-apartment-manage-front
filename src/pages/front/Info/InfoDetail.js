import React, { PureComponent } from 'react';
import { Button, Carousel, Divider, Checkbox, Row, Col ,Card} from 'antd';
import moment from 'moment';
import styles from './Information.less';
class InfoDetail extends PureComponent{
    render(){
        
        const {info}=this.props.location.state;
        const pic=info.pic?info.pic.split(','):[];
        console.log(pic)
        return (
            <Card
                style={{ marginTop: 24 }}
                bordered={false}
                bodyStyle={{ padding: '8px 32px 32px 32px' ,width:"100%"}}
            >
                <div className={styles.title}>
                    <h2>{info.title}</h2>
                    <p>
                        发布时间：{moment(info.publishTime).format('YYYY-MM-DD HH:mm:ss')}  &nbsp; &nbsp;
                        来源：转载 &nbsp; &nbsp;
                        发布者：{info.publisher}</p>
                </div>
              <div className={styles.text}>
                    <div className={styles.desc}>
                        <p>
                            <span>&nbsp; &nbsp;&nbsp; &nbsp;{info.summary}</span>
                        </p>

                    </div>
        
                    { pic[0]?
                    <div  style={{display:"flex",justifyContent:"center"}}>
                        <img
                        width={660} height={380}
                        alt="logo"
                        src={'http://127.0.0.1:8080/common/getImage?filename=' + pic[0]}
                        />
                    </div>
                    :<span>无图</span>}
                    <div>
                            <p>
                            <span>&nbsp; &nbsp;&nbsp; &nbsp;{info.content}</span>
                            </p>
                    </div>
                    { pic[1]?
                    <div  style={{display:"flex",justifyContent:"center"}}>
                        <img
                        width={660} height={380}
                        alt="logo"
                        src={'http://127.0.0.1:8080/common/getImage?filename=' + pic[1]}
                        />
                    </div>
                    :<span>无图</span>}
                </div>
            </Card>
        );
    }
}

export default InfoDetail;