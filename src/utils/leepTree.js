var treeData = [
  {
    name: 'Node1',
    value: '0-0',
    id: 'id',
    children: [
      {
        name: 'title',
        value: '0-0-1',
        id: '0-0-1',
      },
      {
        name: 'Child Node2',
        value: '0-0-2',
        id: '0-0-2',
      },
    ],
  }
];
function a(treeData){
  for (var i = 0; i < treeData.length; i++) {
    console.log(treeData[i].name)
    treeData[i].name = treeData[i].name;
    if(treeData[i].children&&treeData[i].children.length>0){
      a(treeData[i].children);
    }
  }
}
a(treeData)
