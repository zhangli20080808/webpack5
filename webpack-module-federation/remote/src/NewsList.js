import React, { useState } from "react";
const NewsList = () => {
  const [data, setData] = useState([
    { name: "新闻资讯", id: 1 },
    { name: "体坛款寻", id: 2 },
  ]);
  return (
    <div>
      <h4>newList</h4>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default NewsList;
