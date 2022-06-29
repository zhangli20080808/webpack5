import React from 'react';
import Slides from './Slides';
const RemoteNewList = React.lazy(()=>import('remoteApp/NewsList'));
const App = ()=>(
    <div>
        <p>我是 hostApp - 8081</p>
        <h3>本地组件Slides - show</h3>
        <Slides></Slides>
        <hr/>
        <h3>远程组件NewsList</h3>
        <React.Suspense fallback="Loading NewsList">
            <RemoteNewList/>
        </React.Suspense>
    </div>
)
export default App;