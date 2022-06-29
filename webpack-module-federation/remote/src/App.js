import React from 'react';
import NewsList from './NewsList';
const RemoteSlides = React.lazy(() => import('hostApp/Slides'));
const App = () => (
  <div>
    <p>我是 remoteApp - 8082</p>
    <h3>本地组件NewsList - show</h3>
    <NewsList />
    <hr />
    <h3>远程组件NewsList</h3>
    <React.Suspense fallback="Loading RemoteSlides">
      <RemoteSlides />
    </React.Suspense>
  </div>
);
export default App;
