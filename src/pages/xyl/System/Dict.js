import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Divider ,  Popconfirm,message,Button,Row,Col,Tree } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import dictStyle from './Dict.less'
import styles from '../TableList.less';
import AddDictType from './AddDictType'
import EditDictType from './EditDictType'
const { TreeNode } = Tree;
@connect(({ dict, loading }) => ({
    dict,
    loading: loading.models.dict,
  }))
@Form.create()
class Dict extends PureComponent{
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        selectNodeId:{},
        checkNodeIds:[]
      };
    
      columns = [
        {
          title: '字典编号',
          dataIndex: 'id',
        },
        {
          title: '类型编号',
          dataIndex: 'dictTypeId',
        },
        {
          title: '字典名',
          dataIndex: 'name',
        },
        {
          title: '字典值',
          dataIndex: 'value',
        },
        {
          title: '是否默认',
          dataIndex: 'isDefault',
        //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
    
        {
          title: '操作',
          render: (text, record) => (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="您确认要删除这条数据吗?"
                onConfirm={() => {
                  this.confirm(record.id);
                }}
                onCancel={this.cancel}
                okText="确认"
                cancelText="取消"
              >
                <a href="#">删除</a>
              </Popconfirm>
            </Fragment>
          ),
        },
      ];
    
      confirm = (rowId, e) => {
        //console.log(e);
        const { dispatch } = this.props;
        //console.log(rowId);
        dispatch({
          type: 'dict/deleteDict',
          payload: { id: rowId },
          callback: res => {
            console.log(res); // 请求完成后返回的结果
            if (res.code == 200) {
              message.success('删除成功');
              dispatch({ type: 'dict/dictList' });
            }
          },
        });
      };
    
      cancel = e => {
        console.log(e);
        message.error('Click on No');
      };
    
      componentDidMount() {
        //当组件挂载完成后执行加载数据
        const { dispatch } = this.props;
        dispatch({
          type: 'dict/dictTypeAll',
        });
        dispatch({
            type: 'dict/dictList',
          });
      }
      reloadDictType() {
        const { dispatch } = this.props;
        dispatch({
          type: 'dict/dictTypeAll',
        });
      }

      reloadDict(id) {
        const { dispatch } = this.props;
        dispatch({
          type: 'dict/dictList',
          payload:{dictTypeId:id}
        });
      }
    
      handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
    
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});
    
        const params = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          ...formValues,
          ...filters,
        };
        if (sorter.field) {
          params.sorter = `${sorter.field}_${sorter.order}`;
        }
    
        dispatch({
          type: 'dict/dictList',
          payload: params,
        });
      };
    

    
      handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
      };
    
      handleSearch = e => {
        e.preventDefault();
    
        const { dispatch, form } = this.props;
    
        form.validateFields((err, fieldsValue) => {
          if (err) return;
    
          const values = {
            ...fieldsValue,
            updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
          };
    
          this.setState({
            formValues: values,
          });
    
          dispatch({
            type: 'question/fetch',
            payload: values,
          });
        });
      };
    
      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        return (
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 5, lg: 24, xl: 48 }}>
              <Col md={8} sm={48}>
                {getFieldDecorator('keyWord')(<Input placeholder="请输入关键字 如 资讯标题/发布者" />)}
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit" icon="search">
                    搜索
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>
        );
      }
      //树节点点击
      onSelect = (selectedKeys, info) => {
        this.setState({selectNodeId:selectedKeys[0]})
        this.reloadDict(selectedKeys[0]);
      };
      //树节点选中
      onCheck = (checkedKeys, info) => {
        this.setState({checkNodeIds:checkedKeys})
      };
      //删除树节点
      delDictType=(checkNodeIds)=>{
        const {dispatch}=this.props;
        if(Array.isArray(checkNodeIds)){
          if(checkNodeIds.length===1){
            dispatch({
              type: 'dict/deleteDictType',
              payload: { id: checkNodeIds[0] },
              callback: res => {
                console.log(res); // 请求完成后返回的结果
                if (res.code == 200) {
                  message.success('删除成功');
                  dispatch({ type: 'dict/dictTypeAll' });
                }
              },
            });
          }else{
            message.error("请选择一个字典类型删除！");
          }
        }else{
          message.error("请选择需要删除的字典类型！");
        }
      }
    render(){
       
        const { types}=this.props.dict;
        const {
            loading,
            dict: { data }
            } = this.props;
          const { selectedRows ,checkNodeIds} = this.state;
        const children = [];
       // console.log(type.data)
        const arr=types.data
        arr?arr.forEach((item,index,array)=>{
            //console.log(item)
            children.push( <TreeNode title={item.dictTypeName} key={item.id} />);
        }):arr

        return (
            <PageHeaderWrapper title="字典管理">
                <Card>
                <Row gutter={16}> 
                    <Col  span={8}>
                        <div className={dictStyle.line}>
                            <Row>
                                <Col span={7} >
                                  <span>字典类型</span>
                                </Col>
                                <Col span={17} className={dictStyle.right}>
                                    <AddDictType reloadDictType={this.reloadDictType.bind(this)} />
                                    <EditDictType checkNodeIds={checkNodeIds} reloadDictType={this.reloadDictType.bind(this)}/>
                                    <Button type="link" icon="delete" onClick={()=>{this.delDictType(checkNodeIds)}}>删除</Button>
                                </Col>
                            </Row>
                        </div>
                        <Tree
                            checkable
                            defaultExpandAll
                             onSelect={this.onSelect}
                             onCheck={this.onCheck}
                        >
                            <TreeNode title="字典类型树" key="0" >
                                {children}
                            </TreeNode>
                        </Tree>
                    </Col>
                    <Col  span={16}>
                        <div className={dictStyle.line}>
                            <Row>
                                <Col span={7}>
                                  <span>字典</span>
                                </Col>
                                <Col span={17} className={dictStyle.right}>
                                    <Button type="link" icon="plus">新增</Button>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.tableList}>
                            <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={this.columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            />
                        </div>
                    </Col>
                </Row>
                </Card>
            </PageHeaderWrapper>
            
        );
    }
}

export default Dict;