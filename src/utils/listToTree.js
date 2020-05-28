var listData = [
  { id: 1, name: '第一级数据1', sex: 1, pid: -1 },
  { id: 2, name: '第一级数据2', sex: 2, pid: -1 },
  { id: 3, name: '第二级数据1', sex: 2, pid: 1 },
  { id: 4, name: '第二级数据2', sex: 1, pid: 2 },
  { id: 5, name: "第三级数据1", sex: 1, pid: 3 },
  { id: 6, name: "第三级数据2", sex: 1, pid: 3 },
  { id: 7, name: "第三级数据3", sex: 1, pid: 3 },
  { id: 8, name: "第四级数据1", sex: 1, pid: 7 },
];
var getChildren = function (data, root) {
  var children = [];
  for (var i = 0; i < data.length; i++) {
    if (root == data[i].pid) {
      if(getChildren(data, data[i].id)&&getChildren(data, data[i].id).length>0){
        data[i].children = getChildren(data, data[i].id);
      }
      data[i].title = data[i].name;
      delete data[i].name;
      children.push(data[i]);
    }
  }
  return children;
}

var childData = getChildren(listData, -1);

