import React from "react";
const RemoteHostSlides = React.lazy(() => import("hostApp/Slides"));
const RemoteAppNewList = React.lazy(() => import("remoteApp/NewsList"));
//TopAwait webpack5的新语法

// let RemoteNewList = await import('remote/NewsList');
// RemoteNewList = RemoteNewList.default;
//React.lazy
/* function lazy(fn){
    return class extends React.Component{
        state = {Component:null};
        componentDidMount(){
            fn().then(result=>{
                this.setState({Component:result.default});
            });
        }
        render(){
            let {Component} =this.state;
            return Component?<Component/>:null;
        }
    }
} */

const App = () => (
  <div>
    <h3>远程组件 hostApp - Slides</h3>
    <React.Suspense fallback="Loading RemoteSlides">
      <RemoteHostSlides />
    </React.Suspense>
    <hr />
    <h3>远程组件 remoteApp - NewsList</h3>
    <React.Suspense fallback="Loading NewsList">
      <RemoteAppNewList />
    </React.Suspense>
  </div>
);
export default App;
