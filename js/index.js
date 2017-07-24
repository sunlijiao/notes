angular.module("myApp",[]).controller("note",["$scope","$filter",function ($scope,$filter) {
    //获取数据
  
    $scope.data=getItem('note')?JSON.parse(getItem('note')):[];
    //当前的index
    $scope.currentid=$scope.data[0]?$scope.data[0]:null;
//    获取当前的数组
    $scope.currentArr=$scope.currentid?$scope.data[getId($scope.currentid)]:{title:""};
    $scope.val=''
    //添加任务
     $scope.keydown = function(){
       
       if(event.keyCode !==13) return;
       $scope.isshow=true;
       var obj={};
       obj.title=this.val;
       obj.id=setId();//唯一的ID
       obj.son=[];
       $scope.data.push(obj);
       $scope.currentid=obj.id;
       $scope.currentArr=$scope.currentid?$scope.data[getId($scope.currentid)]:{title:""};
      
       setItem('note',$scope.data);
       this.val=''
     }
    

    //删除任务
    $scope.dellist=function (id) {
        var index=getId(id);
        var len=$scope.data.length-1;
        if(len==0){
            $scope.currentid =null;
            $scope.currentArr = $scope.currentid ? $scope.data[getId($scope.currentid)] : {title: ""};
          
        }else {
            if (index==len) {
                $scope.currentid = $scope.data[len-1].id;
                $scope.currentArr = $scope.currentid ? $scope.data[getId($scope.currentid)]:{title: ""};
            } else if(index <len) {
                $scope.currentid = $scope.data[index + 1].id;
                $scope.currentArr = $scope.currentid ? $scope.data[getId($scope.currentid)]:{title: ""};
            }
          
        }
        
        $scope.data.splice(index,1);
        setItem('note',$scope.data);
    }
     //获得焦点
    $scope.focus=function(id){
        $scope.isshow=true;
        $scope.currentid=id;
        $scope.currentArr=$scope.currentid?$scope.data[getId($scope.currentid)]:{title:""}
    }
    //失去焦点
    $scope.blur=function(){
        setItem('note',$scope.data);
    }
    $scope.blurcon=function(){
        setItem('note',$scope.data);
    }

    $scope.addcon=function(){
       if( !$scope.data.length) {
         alert('请先在左下角输入框添加数据');
         return;
       }
        $scope.isshow=true;
        var son=$scope.currentArr.son;
        var id=son.length>0?son[son.length-1].id+1:1;
        
        $scope.currentArr.son.push({con:"",id:id});
        setItem('note',$scope.data);
    }
    $scope.delcon=function(id){
        var son=$scope.currentArr.son;
        for(var i=0;i<son.length;i++){
            if(son[i].id==id){
                son.splice(i,1)
            }
        }
        setItem('note',$scope.data);
    }
    //显示已完成的信息
    $scope.showdone=function(){
        $scope.isshow=false;
    }
    // 已完成项
    $scope.isshow=true;
  
  $scope.successData=getItem('succ')?JSON.parse(getItem('succ')):[];
    $scope.done=function(id){

        var son=$scope.currentArr.son;
        var title=$scope.currentArr.title;
        for(var i=0;i<son.length;i++){
            if(son[i].id==id){
                var obj=son.splice(i,1);
                obj[0].parent=title;
                $scope.successData.push(obj);
              
            }
        }
      
      setItem('succ',$scope.successData);
      setItem('note',$scope.data);
    }
    //删除已完成项
    $scope.deldone=function(id){
        var arr=$scope.successData;
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                arr.splice(i,1)
              
            }
        }
        
        setItem('succ',$scope.successData);
        
    }
    //监听
    $scope.$watch("search",function(){
        $scope.isshow=true;
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        if(arr.length>0){
            $scope.currentid=arr[0].id;
            $scope.currentArr=$scope.currentid?$scope.data[getId($scope.currentid)]:{title:""};
        }
    })
    //获取某条数据的索引值
    function getId(id) {
        var data=$scope.data;
        var len=data.length;
        for(var i=0;i<len;i++){
            if(data[i].id==id){
                return i;
            }
        }
    }

    function setId() {
        if($scope.data.length>0){
            return $scope.data[$scope.data.length-1].id+1;
        }else{
            return 1;
        }
    }
    
    function setItem(name,data){
      return  localStorage.setItem(name,JSON.stringify(data));
    }
    function getItem(name){
      return localStorage.getItem(name);
    }
}])