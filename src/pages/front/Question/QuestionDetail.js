import React, { PureComponent } from 'react';
import {
  Comment,
  Icon,
  Tooltip,
  Avatar,
  Input,
  Form,
  Card,
  Select,
  List,
  Button,
  Row,
  Col,
  Tag,
} from 'antd';
import styles from './Question.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class QuestionDetail extends PureComponent {
  constructor(props) {
    super(props)
    const { state } = this.props.location
    if (!(state && state.question)) {
        this.props.history.goBack()
    }
}
  render() {
    const { question } = this.props.location.state;
    return (
      <div className={styles.container}>
        <Card>
          <h1>{question.questions}</h1>
          <p className={styles.quer}>
            <span>
              提问者：
              {question.questioner}
            </span>
            &nbsp;
            <span>
              时间：
              {moment(question.quiz_time).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </p>
          {question.summary ? (
            <div>
              <Avatar
                src={'http://127.0.0.1:8080/common/getImage?filename=' + question.questionerAvatar}
                alt={question.questioner}
              />
              <p className={styles.info}>
                <span />
                {question.summary}
              </p>
            </div>
          ) : (
            <div />
          )}
        </Card>
        <Card style={{ marginTop: '10px', minHeight: '300px' }}>
          <Comment
            // actions={actions}
            author={question.answerer}
            avatar={
              <Avatar
                src={'http://127.0.0.1:8080/common/getImage?filename=' + question.answererAvatar}
                alt={question.answerer}
              />
            }
            content={<p>{question.answer}</p>}
            datetime={
              <Tooltip title={moment(question.answer_time).format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment(question.answer_time).fromNow()}</span>
              </Tooltip>
            }
          />
        </Card>
      </div>
    );
  }
}

export default QuestionDetail;
