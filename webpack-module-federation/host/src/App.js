import React from 'react';
import Slides from './Slides';
const RemoteNewList = React.lazy(()=>import('remote/NewsList'));
const App = ()=>(
    <div>
        <p>我是host</p>
        <h3>本地组件Slides</h3>
        <Slides></Slides>
        <hr/>
        <h3>远程组件NewsList</h3>
        <React.Suspense fallback="Loading NewsList">
            <RemoteNewList/>
        </React.Suspense>
    </div>
)
export default App;