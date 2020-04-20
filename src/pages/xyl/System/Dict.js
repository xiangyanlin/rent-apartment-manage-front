import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Divider ,  Popconfirm,message,Button,Row,Col,Tree } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TreeNode } = Tree;
@connect(({ dict, loading }) => ({
    dict,
    loading: loading.models.dict,
  }))
@Form.create()
class Dict extends React.Component{
    render(){
        return (
            <PageHeaderWrapper title="字典管理">
                <Card>
                <Row gutter={16}> 
                    <Col  span={6}>
                        <Tree
                            checkable
                            defaultExpandedKeys={['0-0-0', '0-0-1']}
                            defaultSelectedKeys={['0-0-0', '0-0-1']}
                            defaultCheckedKeys={['0-0-0', '0-0-1']}
                            // onSelect={this.onSelect}
                            // onCheck={this.onCheck}
                        >
                            <TreeNode title="字典类型树" key="0-0">
                                <TreeNode title="parent 1-0" key="0-0-0" />
                                <TreeNode title="parent 1-1" key="0-0-1"/>
                            </TreeNode>
                        </Tree>
                    </Col>
                    <Col  span={18}>
                        <div>字典列表</div>
                    </Col>
                </Row>
                </Card>
            </PageHeaderWrapper>
            
        );
    }
}

export default Dict;