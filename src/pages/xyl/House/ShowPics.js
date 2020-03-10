import React  from 'react';
import { Modal, Button, Carousel } from 'antd';


class ShowPics extends React.Component{

  info = () => {
    Modal.info({
      title: '',
      iconType:'false',
      width: '800px',
      okText: "ok",
      content: (
        <div style={{width:650, height: 400, lineHeight:400, textAlign:"center"}}>
          <Carousel autoplay={true}>
            {
            this.state.url.split(',').map((value,index) => {
              return <div><img style={{ maxWidth:600 ,maxHeight:400, margin:"0 auto" }} src={value}/></div>
            })
          }
          </Carousel>
        </div>
      ),
      onOk() {},
    });
  };
  
  constructor(props){
    super(props);
    //console.log(this.props.pics);
    const url="http://127.0.0.1:8080/common/getImage?filename="+this.props.pics;
    this.state={
      btnDisabled: this.props.pics? false: true,
      url:url
    }
  }



  render() {
    return (
      <div>
        <Button disabled={this.state.btnDisabled} icon="picture" shape="circle" onClick={()=>{this.info()}} />
      </div>
    )
  }

}

export default ShowPics;
