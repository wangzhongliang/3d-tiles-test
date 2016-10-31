var btn = document.createElement('button');
btn.setAttribute('type','button');
btn.setAttribute('title','MeasureBox');
btn.setAttribute('onclick','toggleMeasureBox()');
btn.setAttribute('class','cesium-button cesium-toolbar-button');
btn.innerHTML = '<img style="padding:1px;" src="img/ruler.png">';
document.getElementsByClassName('cesium-viewer-toolbar')[0].appendChild(btn);

var measureBox = document.createElement('div');
measureBox.setAttribute('id', 'measureBox');

measureBox.setAttribute('style', 'left:32px;top:32px;');
document.body.appendChild(measureBox);
var draggingbox = false;
var startX;
var startY;
var startLeft;
var startTop;
function mousedown(event){
	startX = event.clientX;
	startY = event.clientY;
	startLeft = getNum(getStyle(measureBox,'left'));
	startTop = getNum(getStyle(measureBox,'top'));
	draggingbox = true;
}
function mouseup(){
	draggingbox = false;
}
function mousemove(event){
	if(draggingbox){
		var offsetLeft = startLeft+event.clientX-startX;
		var offsetTop = startTop+event.clientY-startY;
		measureBox.style.left = offsetLeft+'px';
		measureBox.style.top = offsetTop+'px';
		//console.log(offsetLeft,offsetTop);
	}

}
function getNum(text){
	//var value = text.replace(/[^0-9]/ig,"");
	return parseFloat(text)?parseFloat(text):0;		
	//return value;
}
function getStyle(obj, attr){  
	if(obj.currentStyle)  
	{  
		return obj.currentStyle[attr];  
	}  
	else  
	{  
		return getComputedStyle(obj,null)[attr];  
	}  
}
var boxBody = document.createElement('div');
boxBody.setAttribute('id', 'boxBody');
measureBox.appendChild(boxBody);

var boxBody_tit = document.createElement('div');
boxBody_tit.setAttribute('id', 'boxBody_tit');
boxBody_tit.setAttribute('onmousedown', 'mousedown(event)');
document.body.setAttribute('onmousemove', 'mousemove(event)');
boxBody_tit.setAttribute('onmouseup', 'mouseup()');
boxBody.appendChild(boxBody_tit);

var topTit = document.createElement('p');
topTit.setAttribute('class', 'topTit');
topTit.innerHTML = '测量工具';
boxBody_tit.appendChild(topTit);

var topC0s = ['线条', '路径', '面积', '3D路径', '3D面积'];
for (var i = 0; i < topC0s.length; i++) {
    var topC0 = document.createElement('p');
    topC0.setAttribute('class', 'topC0');
    topC0.innerHTML = topC0s[i];
    boxBody_tit.appendChild(topC0);
}

var boxBody_cnt = document.createElement('div');
boxBody_cnt.setAttribute('id', 'boxBody_cnt');
boxBody.appendChild(boxBody_cnt);

var contents = [
    [{
        id: 'lineTip',
        type: 'tip',
        description: '鼠标单击开始绘制，再次单击结束绘制'
    },{
        id: 'lineDes',
        type: 'description',
        description: '测量地面上两点之间的距离'
    }, {
        id: 'gclength',
        type: 'a',
        name: '地球长度：',
        unit: ['米', '公里']
    }, {
        id: 'geoplength',
        type: 'a',
        name: '地图投影长度：',
        unit: ['米', '公里']
    }, {
        id: 'headingangle',
        type: 'a',
        name: '方位角：',
        unit: ['度']
    }],

    [{
        id: 'pathTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: 'pathDes',
        type: 'description',
        description: '测量地面上多个点之间的距离'
    }, {
        id: 'pathlength',
        type: 'a',
        name: '路径长度：',
        unit: ['米', '公里']
    }, {
        id: 'profile',
        type: 'checkbox',
        name: '显示海拔剖面图'
    }],

    [{
        id: 'areaTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: 'areaDes',
        type: 'description',
        description: '测量地面上几何形状的周长和面积'
    }, {
        id: 'globeA',
        type: 'a',
        name: '面积：',
        unit: ['平方米', '平方公里']
    }, {
        id: 'perimeter',
        type: 'a',
        name: '周长：',
        unit: ['米', '公里']
    }
    ],

    [{
        id: '3DLineTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: '3DLineDes',
        type: 'description',
        description: '测量三维建筑物的高度和宽度，以及从建筑物上的点到地面的距离'
    }, {
        id: '3DLength',
        type: 'a',
        name: '长度：',
        unit: ['厘米', '米', '公里']
    }],

    [{
        id: '3DAreaTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: '3DAreaDes',
        type: 'description',
        description: '测量三维建筑物上几何形状的面积'
    }, {
        id: '3DArea',
        type: 'a',
        name: '面积：',
        unit: ['平方厘米', '平方米', '平方公里']
    }, {
        id: '3DPerimeter',
        type: 'a',
        name: '周长：',
        unit: ['厘米', '米', '公里']
    }]
];
var emptytag = document.createElement('SPAN');
//emptytag.innerHTML = "鼠标单击绘制，双击结束绘制";
boxBody_cnt.appendChild(emptytag);
for (i = 0; i < contents.length; i++) {
    var content = contents[i];
    var tag = document.createElement('SPAN');
    boxBody_cnt.appendChild(tag);
    for (var j = 0; j < content.length; j++) {
        if (content[j].type == 'a') {
            tag.innerHTML += '<A>' + content[j].name + '</A><A id="' + content[j].id + '"> </A>';
            var units = content[j].unit;
            var selectbox = document.createElement('select');
            selectbox.setAttribute('id', 'sb_' + content[j].id);
            selectbox.setAttribute('onchange', 'calc_' + (i + 1) + '(positions)');
            selectbox.setAttribute('class', 'selectbox');
            tag.appendChild(selectbox);
            //tag.innerHTML+='<select>';
            for (var k = 0; k < units.length; k++) {
                var option = document.createElement('option');
                option.setAttribute('value', units[k]);
                option.innerHTML = units[k];
                selectbox.appendChild(option);
                //selectbox.innerHTML+='<option value="'+units[k]+'">'+units[k]+'</option>';
            }
            //tag.innerHTML+='</select><BR>'
        }
        else if (content[j].type == 'checkbox') {
            tag.innerHTML += '<label style="vertical-align:middle;"><input type="checkbox" style="vertical-align:middle;" id="cb_' + content[j].id + '" /> ' + content[j].name + '</label>';
        }
        else if (content[j].type == 'description') {
            tag.innerHTML += '<P><strong style="color:yellow">' + content[j].description + '<strong></P>';
        }
		else if(content[j].type == 'tip'){
			tag.innerHTML += '<P><strong style="color:yellow">提示: ' + content[j].description + '<strong></P>';
		}
        tag.innerHTML += '<BR>';
    }

}

var footer = document.createElement('div');
footer.setAttribute('id', 'footer');
boxBody.appendChild(footer);

footer.innerHTML += '<label id="mouseControl" style="vertical-align:middle;"><input type="checkbox" id="cb_mouseControl" style="vertical-align:middle;" onchange="toggleMouse(checked)" checked="true" /> 鼠标导航     </label>' + '<label id="editVertex" style="vertical-align:middle;"><input type="checkbox" id="cb_edit" style="vertical-align:middle;" onchange="toggleEdit(checked)" /> 编辑节点 <span style="color:yellow;">(此时不可绘制)</span></label>' +
    '<input type="button" id="clearAll" onclick="clearAll()" value=" 清除 " />';

function clearAll() {
    viewer.entities.remove(d_polyline);
    viewer.entities.remove(d_polyline2);
    viewer.entities.remove(d_polygon);
    viewer.entities.remove(billboard);
    viewer.entities.remove(startPoint);
    clearText();
    positions = [];
    terrainSamplePositions = [];
    movingPolyline.removeAll();
    pointCollection.removeAll();
    polygonPolyline.removeAll();
}
function toggleMouse(checked) {
    if (checked) {
        // enable the default event handlers
        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableTranslate = true;
        scene.screenSpaceCameraController.enableZoom = true;
        scene.screenSpaceCameraController.enableTilt = true;
        scene.screenSpaceCameraController.enableLook = true;
    }
    else {
        // disable the default event handlers
        scene.screenSpaceCameraController.enableRotate = false;
        scene.screenSpaceCameraController.enableTranslate = false;
        scene.screenSpaceCameraController.enableZoom = false;
        scene.screenSpaceCameraController.enableTilt = false;
        scene.screenSpaceCameraController.enableLook = false;
    }
}
function toggleEdit(checked) {
    if (checked) {
        editing = true;
        drawing = false;
    }
    else {
        editing = false;
    }
}
var profileBox = document.createElement('div');
profileBox.setAttribute('id', 'profileBox');
document.body.appendChild(profileBox);

var title1 = document.createElement('A');
title1.setAttribute('id', 'title1');
title1.innerHTML = '海拔（米）  最大值：   平均值：   最小值：';
profileBox.appendChild(title1);

var title2 = document.createElement('A');
title2.setAttribute('id', 'title2');
title2.innerHTML = '距离：   坡度（度）：';
profileBox.appendChild(title2);

var profileBody = document.createElement('div');
profileBody.setAttribute('id', 'profileBody');
profileBox.appendChild(profileBody);

var charts = document.createElement('div');
charts.setAttribute('id', 'charts');
//charts.setAttribute('style','width:'+profileBox.style.width-40+'px;height:180px;');
var winWidth = document.body.clientWidth;
charts.setAttribute('style', 'width:' + winWidth * 0.99 + 'px;height:191px;');

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(charts);

// 指定图表的配置项和数据
var chartOption = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: '3%',
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                formatter: '{value} 米'
            }
        }
    ],
    series: [
        {
            name: '高度',
            type: 'line',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data: []
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(chartOption);
myChart.on('click', function (params) {
    // 控制台打印数据的名称
    console.log(params);
    viewer.entities.remove(billboard);
    if (terrainSamplePositions.length > 0) {
        var longitude = terrainSamplePositions[params.dataIndex].longitude;
        var latitude = terrainSamplePositions[params.dataIndex].latitude;
        billboard = viewer.entities.add({
            position: Cesium.Cartesian3.fromRadians(longitude, latitude),
            billboard: {
                image: './img/arrow3.png',
                pixelOffset: new Cesium.Cartesian2(0.0, -25),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.0, 1.5e6, 0.8)
            }
        });
    }
    else console.log('terrainSamplePositions is empty');

});
profileBody.appendChild(charts);

var loading = document.createElement('div');
loading.setAttribute('id', 'loading');
profileBody.appendChild(loading);

var img0 = document.createElement('img');
img0.setAttribute('style', 'height:191px;width:0;');
loading.appendChild(img0);

var img = document.createElement('img');
img.setAttribute('src', 'img/loading2.gif');
loading.appendChild(img);

//var viewer = new Cesium.Viewer('cesiumContainer');


//--测试用卡车模型代码--//
// var milkTruck = viewer.entities.add({
    // position: Cesium.Cartesian3.fromDegrees(
        // 121.444565,
        // 31.035253,
        // 0.0),
    // scale: 20,
    // model: {
        // uri: 'model/CesiumMilkTruck.gltf'
    // }
// });
// viewer.zoomTo(milkTruck);
//--测试用卡车模型代码

var geoProj = new Cesium.GeographicProjection();
var webMercatorProj = new Cesium.WebMercatorProjection();

var scene = viewer.scene;
var globe = scene.globe;
var camera = viewer.camera;

var d_polyline;
var d_polyline2;
var d_polygon;
var billboard;
var pointCollection = new Cesium.PointPrimitiveCollection();
scene.primitives.add(pointCollection);
/*var points = viewer.entities.add(new Cesium.Entity());
 viewer.entities.add({
 parent:points,
 position : Cesium.Cartesian3.fromDegrees(121.444565, 31.035253,10),
 point : {
 pixelSize : 10,
 color : Cesium.Color.RED
 }
 });
 viewer.entities.add({
 parent:points,
 position : Cesium.Cartesian3.fromDegrees(121.444565, 31.035253,5),
 point : {
 pixelSize : 10,
 color : Cesium.Color.YELLOW
 }
 });*/

/*var pointCollection = new Cesium.PointPrimitiveCollection();
 pointCollection.add({
 position : Cesium.Cartesian3.fromDegrees(121.444565, 31.035253,15),
 pixelSize : 10,
 color : Cesium.Color.BLUE
 });
 pointCollection.add({
 position : Cesium.Cartesian3.fromDegrees(121.444565, 31.035253,10),
 pixelSize : 10,
 color : Cesium.Color.RED
 });
 pointCollection.add({
 position : Cesium.Cartesian3.fromDegrees(121.444565, 31.035253,5),
 pixelSize : 10,
 color : Cesium.Color.YELLOW
 });
 scene.primitives.add(pointCollection);
 pointCollection.add({
 position : Cesium.Cartesian3.fromDegrees(121.444565, 31.035253,20),
 pixelSize : 10,
 color : Cesium.Color.GREEN
 });*/

var movingPolyline = new Cesium.PolylineCollection();
scene.primitives.add(movingPolyline);
var polygonPolyline = new Cesium.PolylineCollection();
scene.primitives.add(polygonPolyline);

var drawing = false;
var editing = false;
var vertexMoving = false;
var movingindex = -1;
var positions = [];
var startPoint;

var leftClick;
var dbClick;
var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
function startDrawing() {
    viewer.scene.globe.depthTestAgainstTerrain = false;
    leftClick = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    dbClick = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    handler.setInputAction(
        function (click) {
            // var pickedObject = scene.pick(click.position);
            var cartesian = scene.pickPosition(click.position);
            var ray = camera.getPickRay(click.position);
            var intersection = globe.pick(ray, scene);
            //var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            if (scene.pickPositionSupported && (Cesium.defined(cartesian) || Cesium.defined(intersection))) {
                if (flag == 1) {
                    console.log('flag 1');
                    if (drawing) {
                        clear();
                        positions.push(intersection);
                        draw(positions);
						// drawEP(positions[positions.length-1]);
                        calc_1(positions);
                        drawing = !drawing;
                    }
                    else if (editing) {
                        if(vertexMoving==false) {
                            var pickedObject = scene.pick(click.position);
                            if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
                                movingindex = pickedObject.primitive._index;
                                vertexMoving = !vertexMoving;
                            }
                        }
                        else{
                            clear();
                            draw(positions);
                            calc_1(positions);
                            vertexMoving = !vertexMoving;
                            movingindex = -1;
                        }
                    }
                    else {//起始点
                        clear();
                        positions = [];
                        positions.push(intersection);
                        drawSP(intersection);
                        drawing = !drawing;
                    }
                }
                else if (flag == 2) {
                    console.log('flag 2');
                    if (drawing) {
                        clear();
                        positions.push(intersection);
                        draw(positions);
                        //console.log(intersection);
                        calc_2(positions);
                    }
                    else if (editing) {
                        if(vertexMoving==false) {
                            pickedObject = scene.pick(click.position);
                            if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
                                movingindex = pickedObject.primitive._index;
                                vertexMoving = !vertexMoving;
                            }
                        }
                        else{
                            clear();
                            draw(positions);
                            calc_2(positions);
                            drawProfile(positions);
                            vertexMoving = !vertexMoving;
                            movingindex = -1;
                        }
                    }
                    else {//起始点
                        clear();
                        positions = [];
                        positions.push(intersection);
                        drawSP(intersection);
                        drawing = !drawing;
                    }
                }
                else if (flag == 3) {
                    console.log('flag 3');
                    if (drawing) {
                        clear();
                        positions.push(intersection);
                        drawP(positions);
                        calc_3(positions);
                    }
					else if (editing) {
                        if(vertexMoving==false) {
                            pickedObject = scene.pick(click.position);
                            if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
                                movingindex = pickedObject.primitive._index;
                                vertexMoving = !vertexMoving;
                            }
                        }
                        else{
                            clear();
                            drawP(positions);
                            calc_3(positions);
                            vertexMoving = !vertexMoving;
                            movingindex = -1;
                        }
                    }
                    else {//起始点
                        clear();
                        positions = [];
                        positions.push(intersection);
                        drawSP(intersection);
                        drawing = !drawing;
                    }
                }
                else if (flag == 4) {
                    console.log('flag 4');
                    if (drawing) {//中间点
                        clear();
                        positions.push(cartesian);
                        draw(positions);
                        calc_4(positions);
                    }
					else if (editing) {
                        if(vertexMoving==false) {
                            pickedObject = scene.pick(click.position);
                            if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
                                movingindex = pickedObject.primitive._index;
                                vertexMoving = !vertexMoving;
                            }
                        }
                        else{
                            clear();
                            draw(positions);
                            calc_4(positions);
                            vertexMoving = !vertexMoving;
                            movingindex = -1;
                        }
                    }
                    else {//起始点
                        clear();
                        positions = [];
                        positions.push(cartesian);
                        drawSP(cartesian);
                        drawing = !drawing;
                    }
                }
                else if (flag == 5) {
                    console.log('flag 5');
                    if (drawing) {//中间点
                        clear();
                        positions.push(cartesian);
                        drawP3(positions);
                        calc_5(positions);
                    }
					else if (editing) {
                        if(vertexMoving==false) {
                            pickedObject = scene.pick(click.position);
                            if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
                                movingindex = pickedObject.primitive._index;
                                vertexMoving = !vertexMoving;
                            }
                        }
                        else{
                            clear();
                            drawP3(positions);
                            calc_5(positions);
                            vertexMoving = !vertexMoving;
                            movingindex = -1;
                        }
                    }
                    else {//起始点
                        clear();
                        positions = [];
                        positions.push(cartesian);
                        drawSP(cartesian);
                        drawing = !drawing;
                    }
                    // console.log(Cesium.Cartographic.fromCartesian(cartesian));
                }
                changeCursor(drawing);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(
        function (dbclick) {
            // var pickedObject = scene.pick(dbclick.position);
            var cartesian = scene.pickPosition(dbclick.position);
            var ray = camera.getPickRay(dbclick.position);
            var intersection = globe.pick(ray, scene);
            if (scene.pickPositionSupported && (Cesium.defined(cartesian) || Cesium.defined(intersection))) {
				if (flag == 1) {
					/* 				if(drawing){
					 clear();
					 //positions.push(intersection);
					 positions.pop();
					 draw(positions);
					 calc_1(positions);
					 positions = [];
					 }
					 drawing = !drawing; */
				}
				else if (flag == 2) {
					if (drawing) {
						clear();
						//positions.push(intersection);
						positions.pop();
						draw(positions);
						// drawEP(positions[positions.length-1]);
						calc_2(positions);
						drawProfile(positions);
						//positions = [];
                        drawing = !drawing;
					}

				}
				else if (flag == 3) {
					if (drawing) {
						clear();
						//positions.push(intersection);
						positions.pop();
						drawP(positions);
						calc_3(positions);
						//positions = [];
                        drawing = !drawing;
                    }
				}
				else if (flag == 4) {
					if (drawing) {
						clear();
						//positions.push(cartesian);
						positions.pop();
						draw(positions);
						// drawEP(positions[positions.length-1]);
						calc_4(positions);
						//positions = [];
                        drawing = !drawing;
                    }
				}
				else if (flag == 5) {
					if (drawing) {
						clear();
						//positions.push(cartesian);
						positions.pop();
						drawP3(positions);
						calc_5(positions);
						//positions = [];
                        drawing = !drawing;
                    }
				}
				changeCursor(drawing);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    handler.setInputAction(
        function (movement) {
            //var pickedObject = scene.pick(movement.endPosition);
            var cartesian = scene.pickPosition(movement.endPosition);
            var ray = camera.getPickRay(movement.endPosition);
            var intersection = globe.pick(ray, scene);
            if (scene.pickPositionSupported && (Cesium.defined(cartesian) || Cesium.defined(intersection))) {
                if (flag == 1) {
                    if (drawing) {
                        // calc_1(positions);
                        var index = positions.length - 1;
                        moveDraw1(positions[index], intersection);
                        // positions.pop();
                    }
                    else if (editing) {
						var pickedObject = scene.pick(movement.endPosition);
						if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
							scene.canvas.style.cursor = "pointer";
						}
						else scene.canvas.style.cursor = "auto";
                        
                        if (vertexMoving) {
                            // console.log("start vertexMoving");
                            clear();
                            positions = editMoveDraw(movingindex, positions, intersection);
							draw(positions);
                            calc_1(positions);
                        }
                    }
                }
                else if (flag == 2) {
                    if (drawing) {
                        index = positions.length - 1;
                        moveDraw1(positions[index], intersection);
                    }
                    else if(editing) {
						pickedObject = scene.pick(movement.endPosition);
						if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
							scene.canvas.style.cursor = "pointer";
						}
						else scene.canvas.style.cursor = "auto";
                        
                        if (vertexMoving) {
                            console.log("start vertexMoving");
                            clear();
                            positions = editMoveDraw(movingindex, positions, intersection);
                            draw(positions);
                            calc_2(positions);
                        }
                    }
                }
                else if (flag == 3) {
                    if (drawing) {
                        /* var index = positions.length - 1;
                        if (positions.length < 3) moveDraw1(positions[index], intersection);
                        else {
                            moveDraw2(positions[index], intersection, positions[0]);
                        } */
						if(positions.length<2) moveDraw1(positions[0], intersection);
						else{
							clear();
							positions.push(intersection);
							drawP(positions);
							positions.pop();
						}
                    }
					else if(editing) {
						pickedObject = scene.pick(movement.endPosition);
						if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
							scene.canvas.style.cursor = "pointer";
						}
						else scene.canvas.style.cursor = "auto";
                        
                        if (vertexMoving) {
                            console.log("start vertexMoving");
                            clear();
                            positions = editMoveDraw(movingindex, positions, intersection);
                            drawP(positions);
                            calc_3(positions);
                        }
                    }
                }
                else if (flag == 4) {
                    if (drawing) {
                        index = positions.length - 1;
                        moveDraw3(positions[index], cartesian);
                    }
					else if(editing) {
						pickedObject = scene.pick(movement.endPosition);
						if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
							scene.canvas.style.cursor = "pointer";
						}
						else scene.canvas.style.cursor = "auto";
                        
                        if (vertexMoving) {
                            console.log("start vertexMoving");
                            clear();
                            positions = editMoveDraw(movingindex, positions, cartesian);
                            draw(positions);
                            calc_4(positions);
                        }
                    }
                }
                else if (flag == 5) {
                    if (drawing) {
                        index = positions.length - 1;
                        if (positions.length < 3) moveDraw3(positions[index], cartesian);
                        else {
                            moveDraw4(positions[index], cartesian, positions[0]);
                        }
                    }
					else if(editing) {
                        pickedObject = scene.pick(movement.endPosition);
						if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
							scene.canvas.style.cursor = "pointer";
						}
						else scene.canvas.style.cursor = "auto";
						
                        if (vertexMoving) {
                            console.log("start vertexMoving");
                            clear();
                            positions = editMoveDraw(movingindex, positions, cartesian);
                            drawP3(positions);
                            calc_5(positions);
                        }
                    }
                }
            }

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function stopDrawing() {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(leftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(dbClick, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

}

function clear() {
    viewer.entities.remove(d_polyline);
    viewer.entities.remove(d_polyline2);
    viewer.entities.remove(d_polygon);
    viewer.entities.remove(billboard);
    viewer.entities.remove(startPoint);
    // viewer.entities.remove(endPoint);
    movingPolyline.removeAll();
    polygonPolyline.removeAll();
    pointCollection.removeAll();
}
function changeCursor(drawing) {
    if (drawing) scene.canvas.style.cursor = "crosshair";
    else scene.canvas.style.cursor = "auto";
}
function drawSP(position) {
    startPoint = viewer.entities.add({
        position: position,
        point: {
            color: Cesium.Color.RED,
            pixelSize: 8
        }
    }); 
}

function lineCut(left, right) {
    // if(Cesium.Cartesian3.distance(left,right))
    var c = Cesium.Cartesian3.angleBetween(left, right);
    if (Cesium.defined(c) && c >= Cesium.Math.RADIANS_PER_DEGREE * 10) {
        var cartoLeft = Cesium.Cartographic.fromCartesian(left);
        var cartoRight = Cesium.Cartographic.fromCartesian(right);
        var num = 10;
        var line = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [Cesium.Math.toDegrees(cartoLeft.longitude), Cesium.Math.toDegrees(cartoLeft.latitude)],
                    [Cesium.Math.toDegrees(cartoRight.longitude), Cesium.Math.toDegrees(cartoRight.latitude)]
                ]
            }
        };
        var length = turf.lineDistance(line, 'kilometers');
        var movingPositions = [];
        for (var i = 0; i <= num; i++) {
            var along = turf.along(line, length / num * i, 'kilometers');
            var longitude = along.geometry.coordinates[0];
            var latitude = along.geometry.coordinates[1];
            var position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
            movingPositions.push(position);
        }
        return movingPositions;
    }
    else {
        return [left, right];
    }
}
function moveDraw1(left, right) {
    var movingPositions = lineCut(left, right);
    var material = Cesium.Material.fromType('Color', {
        color: (flag == 1 || flag == 3) ? Cesium.Color.BLUE : Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: movingPositions,
        material: material,
        width: 3
    });

}
function drawVertices(currentPositions) {
    for (var i = 0; i < currentPositions.length; i++) {
        pointCollection.add({
            id: 'point',
            position: currentPositions[i],
            pixelSize: 8,
            color: Cesium.Color.RED
        })
    }

}
// function moveDraw2(left, center, right) {
//     var movingPositions1 = lineCut(left, center);
//     var movingPositions2 = lineCut(center, right);
//     var material1 = Cesium.Material.fromType('Color', {
//         color: Cesium.Color.BLUE
//     });
//     var material2 = Cesium.Material.fromType('Color', {
//         color: Cesium.Color.BLUE
//     });
//     movingPolyline.removeAll();
//     movingPolyline.add({
//         positions: movingPositions1,
//         material: material1,
//         width: 3
//     });
//     movingPolyline.add({
//         positions: movingPositions2,
//         material: material2,
//         width: 3
//     });
// }
function moveDraw3(left, right) {
    var material = Cesium.Material.fromType('Color', {
        color: Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: [left, right],
        material: material,
        width: 3
    });
}
function moveDraw4(left, center, right) {
    var material = Cesium.Material.fromType('Color', {
        color: Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: [left, center, right],
        material: material,
        width: 3
    });
}
function editMoveDraw(currentIndex, currentPositions, position) {
    // var material1 = Cesium.Material.fromType('Color', {
    //     color: (flag == 1 || flag == 3) ? Cesium.Color.BLUE : Cesium.Color.YELLOW,
    // });
    // var material2 = Cesium.Material.fromType('Color', {
    //     color: (flag == 1 || flag == 3) ? Cesium.Color.BLUE : Cesium.Color.YELLOW,
    // });
    // var movingPositions;
    //movingPolyline.removeAll();
    if (currentIndex == 0) {
        currentPositions[0] = position;
        // movingPositions = lineCut(currentPositions[0], currentPositions[1]);
        // movingPolyline.add({
        //     positions: movingPositions,
        //     material: material1,
        //     width: 3
        // });
    }
    else if (currentIndex == (currentPositions.length - 1)) {
        currentPositions[currentPositions.length - 1] = position;
        // movingPositions = lineCut(currentPositions[currentPositions.length - 2], currentPositions[currentPositions.length - 1]);
        // movingPolyline.add({
        //     positions: movingPositions,
        //     material: material1,
        //     width: 3
        // });
    }
    else{
        currentPositions[currentIndex] = position;
        // var movingPositions1 = lineCut(currentPositions[currentIndex-1], currentPositions[currentIndex]);
        // var movingPositions2 = lineCut(currentPositions[currentIndex],currentPositions[currentIndex+1]);
        // movingPolyline.add({
        //     positions: movingPositions1,
        //     material: material1,
        //     width: 3
        // });
        // movingPolyline.add({
        //     positions: movingPositions2,
        //     material: material1,
        //     width: 3
        // });
    }
    return currentPositions;
}
// function editMoveDraw2(currentIndex, currentPositions, position) {
//     movingPolyline.removeAll();
//     if (currentIndex == 0) {
//         currentPositions[0] = position;
//     }
//     else if (currentIndex == (currentPositions.length - 1)) {
//         currentPositions[currentPositions.length - 1] = position;
//     }
//     else{
//         currentPositions[currentIndex] = position;
//     }
//     return currentPositions;
// }
function draw(currentPositions) {
	drawVertices(currentPositions);
    d_polyline = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(function () {
                return currentPositions;
            }, false),
            material: (flag == 1) ? Cesium.Color.BLUE : Cesium.Color.YELLOW,
            width: 3
        }
    });
    
}
function drawP(currentPositions) {
	for(var i = 0; i<currentPositions.length;i++){		
		var material = Cesium.Material.fromType('Color', {
			color: Cesium.Color.BLUE
		});
		if(i==currentPositions.length-1){
			var cutPositions = lineCut(currentPositions[i], currentPositions[0]);
			polygonPolyline.add({
				positions: cutPositions,
				material: material,
				width: 3
			})
		}
		else{
			cutPositions = lineCut(currentPositions[i], currentPositions[i+1]);
			polygonPolyline.add({
				positions: cutPositions,
				material: material,
				width: 3
			})
		}		
	}
    drawVertices(currentPositions);
}
function drawP3(currentPositions) {
    //currentPositions.push(currentPositions[0]);
    //console.log('before draw: '+currentPositions);
    d_polyline = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(function () {
                return currentPositions;
            }, false),
            material: Cesium.Color.YELLOW,
            width: 3
        }
    });
    if (currentPositions.length > 2) {
        d_polyline2 = viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(function () {
                    return [currentPositions[0], currentPositions[currentPositions.length - 1]];
                }, false),
                material: Cesium.Color.YELLOW,
                width: 3
            }
        });
    }
    drawVertices(currentPositions);
}

var R = 6371000; // km

function gcDist(left, right) {
    //基于Haversine formula计算大圆线长度
    var carto1 = Cesium.Cartographic.fromCartesian(left);
    var carto2 = Cesium.Cartographic.fromCartesian(right);

    var lat1 = carto1.latitude;
    var lat2 = carto2.latitude;
    var lon1 = carto1.longitude;
    var lon2 = carto2.longitude;

    var dLat = Math.abs(lat1 - lat2);
    var dLon = Math.abs(lon1 - lon2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c;
    return {angle: c, dist: d};
}
function calc_1(curPositions) {
    var len = curPositions.length;
    //var length = 0;//Cartesian3 distance
    var length1 = 0;//GeographicProjection distance
    //var length2 = 0;//WebMercatorProjection distance
    var length3 = 0;//大圆线
    var left1, right1, left2, right2;
    var carto = Cesium.Cartographic.fromCartesian(curPositions[0]);
    right1 = geoProj.project(carto);
    right1.height = 0;
    right2 = webMercatorProj.project(carto);
    right2.height = 0;
    for (var i = 0; i < len - 1; i++) {
        var carto0 = Cesium.Cartographic.fromCartesian(curPositions[i + 1]);
        carto0.height = 0;

        left1 = right1;
        right1 = geoProj.project(carto0);
        left2 = right2;
        right2 = webMercatorProj.project(carto0);

        //length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i+1]);
        length1 += Cesium.Cartesian3.distance(left1, right1);
        //length2 += Cesium.Cartesian3.distance(left2, right2);

        //基于Haversine formula计算大圆线长度
        length3 += gcDist(curPositions[i], curPositions[i + 1]).dist;
    }

    var A = 0;
    var a = Cesium.Cartographic.fromCartesian(curPositions[0]);
    var b = Cesium.Cartographic.fromCartesian(curPositions[1]);
    var c = Cesium.Cartesian3.angleBetween(curPositions[0], curPositions[1]);
    /*
     var cos_c = Math.cos(Math.PI/2-b.latitude)*Math.cos(Math.PI/2-a.latitude)+Math.sin(Math.PI/2-b.latitude)*Math.sin(Math.PI/2-a.latitude)*Math.cos(b.longitude-a.longitude);
     var sin_c = Math.sqrt(1-cos_c*cos_c);
     var A = Math.asin((Math.sin(Math.PI/2-b.latitude)*Math.sin(b.longitude-a.longitude))/sin_c);
     if(b.longitude>a.longitude&&b.latitude>a.latitude) A = A;
     else if(b.longitude<=a.longitude&&b.latitude>a.latitude) A = Math.PI*2+A;
     else A = Math.PI-A;

     console.log('Azimuth: '+Cesium.Math.toDegrees(A)); */

    var sin_c = Math.sqrt(1 - Math.cos(c) * Math.cos(c));
    A = Math.asin((Math.sin(Math.PI / 2 - b.latitude) * Math.sin(b.longitude - a.longitude)) / sin_c);
    if (Math.abs(b.longitude - a.longitude) < Math.PI) {
        if (b.longitude > a.longitude && b.latitude > a.latitude) A = A;
        else if (b.longitude <= a.longitude && b.latitude > a.latitude) A = Math.PI * 2 + A;
        else A = Math.PI - A;
    }
    else {
        if (b.longitude < a.longitude && b.latitude > a.latitude) A = A;
        else if (b.longitude >= a.longitude && b.latitude > a.latitude) A = Math.PI * 2 + A;
        else A = Math.PI - A;
    }
    A = Cesium.Math.toDegrees(A);
    unitDetect_1(document.getElementById('sb_gclength').value, 'gclength', length3);
    unitDetect_1(document.getElementById('sb_geoplength').value, 'geoplength', length1);
    document.getElementById('headingangle').innerHTML = A.toFixed(2);

    console.log('Azimuth: ' + Cesium.Math.toDegrees(A));
    //console.log('Cartesian3 distance: '+length);
    //document.getElementById('3DLength').innerHTML = length.toFixed(2);
    console.log('GeographicProjection distance: ' + length1);
    //document.getElementById('geoplength').innerHTML = length1.toFixed(2);
    console.log('Great Circle distance: ' + length3);
    //document.getElementById('gclength').innerHTML = length3.toFixed(2);

    return [length3, length1, A];
}
function calc_2(curPositions) {
    var len = curPositions.length;
    //var length2 = 0;//WebMercatorProjection distance
    var length = 0;//大圆线
    for (var i = 0; i < len - 1; i++) {
        //基于Haversine formula计算大圆线长度
        var carto1 = Cesium.Cartographic.fromCartesian(curPositions[i]);
        var carto2 = Cesium.Cartographic.fromCartesian(curPositions[i + 1]);

        var lat1 = carto1.latitude;
        var lat2 = carto2.latitude;
        var lon1 = carto1.longitude;
        var lon2 = carto2.longitude;

        var dLat = Math.abs(lat1 - lat2);
        var dLon = Math.abs(lon1 - lon2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        length += R * c;
    }
    console.log('Great Circle distance: ' + length);
    //console.log('WebMercatorProjection distance: '+length2);
    unitDetect_1(document.getElementById('sb_pathlength').value, 'pathlength', length);

    return length;
}
function calc_3(curPositions) {
    var carto;
    var cartoArray = [];
    for (var i = 0; i < curPositions.length; i++) {
        carto = Cesium.Cartographic.fromCartesian(curPositions[i]);
        //console.log(carto);
        cartoArray.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
    }
    /* cartoArray.pop();
     cartoArray.pop(); */
    carto = Cesium.Cartographic.fromCartesian(curPositions[0]);
    cartoArray.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);

    var polygon = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [cartoArray]
        }
    };
    var line = {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": cartoArray
        }
    };
    var a = turf.area(polygon);
    var length = 1000 * (turf.lineDistance(line, 'kilometers'));
    unitDetect_1(document.getElementById('sb_perimeter').value, 'perimeter', length);
    unitDetect_2(document.getElementById('sb_globeA').value, 'globeA', a);
    console.log('turf area: ' + a);
    console.log('turf length: ' + length);
    return [a, length];
}
function calc_4(curPositions) {
    var len = curPositions.length;
    var length = 0;//Cartesian3 distance

    for (var i = 0; i < len - 1; i++) {
        length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i + 1]);
    }
    console.log('Cartesian3 distance: ' + length);
    unitDetect_1(document.getElementById('sb_3DLength').value, '3DLength', length);
    return length;
}
function calc_5_1(curPositions) {
    var len = curPositions.length;
    var p0 = curPositions[0];
    var a0 = 0;

    for (i = 1; i < len - 1; i++) {
        var p1 = curPositions[i];
        var p2 = curPositions[i + 1];
        var p0p1 = vec3sub(p1, p0);
        var p0p2 = vec3sub(p2, p0);
        var cross = vec3cross(p0p1, p0p2);
        a0 += vec3mod(cross);

    }
    a0 = a0 / 2;

    var length = 0;//Cartesian3 distance

    for (i = 0; i < len - 1; i++) {
        length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i + 1]);
    }
    length += Cesium.Cartesian3.distance(curPositions[len - 1], curPositions[0]);
    console.log('Cartesian3 distance: ' + length);
    unitDetect_1(document.getElementById('sb_3DPerimeter').value, '3DPerimeter', length);

    console.log('Cartesian3 Area: ' + a0);
    unitDetect_2(document.getElementById('sb_3DArea').value, '3DArea', a0);
    return [a0, length];
}
function calc_5(curPositions){
    var error = 1;//判断多边形共面的角度误差
    var a0 = 0;
    var preCross = new Cesium.Cartesian3();
    var final = false;
    var p0 = curPositions[0];
    if(curPositions.length>2){
        for (i = 1; i < curPositions.length - 1;i++) {
            var p1 = curPositions[i];
            var p2 = curPositions[i+1];
            var p0p1 = vec3sub(p1, p0);
            var p0p2 = vec3sub(p2, p0);
            var cross = vec3cross(p0p1, p0p2);
            var angle = Cesium.Cartesian3.angleBetween(cross, preCross)/Math.PI*180;
            console.log(angle);
            if(Math.abs(angle-0)<error||Math.abs(angle-180)<error||!angle) {
                // console.log('共面');
                preCross = vec3add(preCross,cross);
                final =true;
            }
            else {
                // console.log('不共面');
                a0 +=vec3mod(preCross);
                preCross = cross;
                final = false;

            }
            // a0 += vec3mod(cross);
        }
        if(final) a0+=vec3mod(preCross);
        else a0+=vec3mod(cross);
        a0 = a0 / 2;
    }

    var length = 0;//Cartesian3 distance

    for (i = 0; i < curPositions.length - 1; i++) {
        length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i + 1]);
    }
    length += Cesium.Cartesian3.distance(curPositions[curPositions.length - 1], curPositions[0]);
    console.log('Cartesian3 distance: ' + length);
    unitDetect_1(document.getElementById('sb_3DPerimeter').value, '3DPerimeter', length);

    console.log('Cartesian3 Area: ' + a0);
    unitDetect_2(document.getElementById('sb_3DArea').value, '3DArea', a0);
    return [a0, length];
}
function vec3add(left, right) {
    var result = new Cesium.Cartesian3();
    result.x = left.x + right.x;
    result.y = left.y + right.y;
    result.z = left.z + right.z;
    return result;
}
function vec3sub(left, right) {
    var result = new Cesium.Cartesian3();

    result.x = left.x - right.x;
    result.y = left.y - right.y;
    result.z = left.z - right.z;
    return result;
}
function vec3cross(left, right) {
    var leftX = left.x;
    var leftY = left.y;
    var leftZ = left.z;
    var rightX = right.x;
    var rightY = right.y;
    var rightZ = right.z;

    var x = leftY * rightZ - leftZ * rightY;
    var y = leftZ * rightX - leftX * rightZ;
    var z = leftX * rightY - leftY * rightX;

    var result = new Cesium.Cartesian3();
    result.x = x;
    result.y = y;
    result.z = z;
    return result;
}
function vec3mod(cartesian) {
    return Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
}
function maxMeanMin(arrays) {
    var max = -1000;
    var min = 10000000;
    var sum = 0;
    for (var i = 0; i < arrays.length; i++) {
        sum += arrays[i];
        max = Math.max(max, arrays[i]);
        min = Math.min(min, arrays[i]);
    }
    var mean = sum / (arrays.length);
    return [max, mean, min];
}


tagNames = ['gclength', 'geoplength', 'headingangle', 'pathlength', 'globeA', 'perimeter', '3DLength', '3DArea', '3DPerimeter'];
var Tags = document.getElementById('boxBody_tit').getElementsByTagName('p');
var TagsCnt = document.getElementById('boxBody_cnt').getElementsByTagName('span');
var len = Tags.length;
var flag = 1;//修改默认值
for (i = 1; i < len; i++) {
    Tags[i].value = i;
    //Tags[i].onmouseover=function(){changeNav(this.value)};
    Tags[i].onclick = function () {
        changeNav(this.value)
    };
    TagsCnt[i].className = 'undis';

}
Tags[flag].className = 'topC1';
TagsCnt[flag].className = 'dis';

window.onresize = windowResize;
//document.body.setAttribute('onresize','windowResize');
function windowResize() {
    var winWidth = document.body.clientWidth;
    //alert(winWidth);
    //var charts = document.getElementById('charts');
    charts.setAttribute('style', 'width:' + winWidth * 0.99 + 'px;height:191px;');
    myChart.resize();
}


var cb_profile = document.getElementById('cb_profile');
cb_profile.setAttribute('onchange', 'change_cb(checked)');
function change_cb(checked) {
    if (checked) document.getElementById('profileBox').className = 'show';
    else document.getElementById('profileBox').className = 'hide';
}
function changeNav(v) {
    clear();
    positions = [];
    terrainSamplePositions = [];
    drawing = false;
    changeCursor(drawing);
    /* for(var i = 0;i<tagNames.length;i++){
     console.log(tagNames[i]);
     document.getElementById(tagNames[i]).innerHTML = ' ';
     } */
    clearText();
    Tags[flag].className = 'topC0';
    TagsCnt[flag].className = 'undis';
    flag = v;
    Tags[v].className = 'topC1';
    TagsCnt[v].className = 'dis';
    console.log(flag);
    if (flag == 1 || flag == 2 || flag == 3) viewer.scene.globe.depthTestAgainstTerrain = false;
    else viewer.scene.globe.depthTestAgainstTerrain = true;
}
function clearText() {
    for (var i = 0; i < tagNames.length; i++) {
        console.log(tagNames[i]);
        document.getElementById(tagNames[i]).innerHTML = ' ';
    }
}
function unitDetect_1(unit, id, value) {
    if (unit == '米') document.getElementById(id).innerHTML = value.toFixed(2);
    else if (unit == '公里') document.getElementById(id).innerHTML = (value / 1000).toFixed(2);
    else if (unit == '厘米') document.getElementById(id).innerHTML = (value * 100).toFixed(2);
}
function unitDetect_2(unit, id, value) {
    if (unit == '平方米') document.getElementById(id).innerHTML = value.toFixed(2);
    else if (unit == '平方公里') document.getElementById(id).innerHTML = (value / 1000000).toFixed(2);
    else if (unit == '平方厘米') document.getElementById(id).innerHTML = (value * 10000).toFixed(2);
}

var terrainSamplePositions = [];
var interval = 20;
function drawProfile(curPositions) {
    terrainSamplePositions = [];
    var cartoArr = [];
    for (i = 0; i < curPositions.length; i++) {
        var carto = Cesium.Cartographic.fromCartesian(curPositions[i]);
        cartoArr.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
    }
    var line = {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": cartoArr
        }
    };
    //var line = turf.lineString(cartoArr);
    var length = turf.lineDistance(line, 'kilometers');
    var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: '//assets.agi.com/stk-terrain/world'
    });

    for (i = 0; i <= interval; i++) {
        var along = turf.along(line, length / interval * i, 'kilometers');
        var longitude = along.geometry.coordinates[0];
        var latitude = along.geometry.coordinates[1];
        //console.log(along.geometry.coordinates[0],along.geometry.coordinates[1]);
        //console.log(typeof(along.geometry.coordinates[0]));
        /* viewer.entities.add({
         position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
         point : {
         pixelSize : 5,
         color : Cesium.Color.BLUE
         }
         }); */
        var position = Cesium.Cartographic.fromDegrees(longitude, latitude);
        terrainSamplePositions.push(position);
    }
    //var loading = document.getElementById('loading');
    //loading.className='show';
    myChart.showLoading();
    var promise = Cesium.sampleTerrain(terrainProvider, 9, terrainSamplePositions);

    var categories = [];
    var heights = [];
    promise.then(function () {
        var m2km = false;
        if (Math.round(length / interval * 1000) > 1000) m2km = true;
        for (var i = 0; i < terrainSamplePositions.length; i++) {
            //var height = terrainSamplePositions[i].height;
            var height = parseFloat(terrainSamplePositions[i].height.toFixed(2));
            var tag = m2km ? ((length / interval * i).toFixed(0) + '公里') : ((length / interval * i * 1000).toFixed(0) + '米');//单位转换
            categories.push(tag);
            heights.push(height);
            //console.log(height);
            myChart.hideLoading();
            myChart.setOption({
                xAxis: {
                    data: categories
                },
                series: [{
                    // 根据名字对应到相应的系列
                    data: heights
                }]
            });
            var data = maxMeanMin(heights);
            document.getElementById('title1').innerHTML = '海拔（米）  最大值：<span style="color:red"><strong>' + data[0] + '</strong> 米</span>   平均值：<span style="color:red"><strong>' + data[1].toFixed(2) + '</strong> 米</span>   最小值：<span style="color:red"><strong>' + data[2] + '</strong> 米</span>';
            document.getElementById('title2').innerHTML = '距离：<span style="color:red"><strong>' + (m2km ? length.toFixed(0) + ' 公里</strong>' : (length * 1000).toFixed(0) + ' 米</strong>') + '</span>   坡度（度）：';
        }
        //loading.className='hide';
    }).otherwise(function (error) {
        //Display any errrors encountered while loading.
        console.log(error);
    });
    //Cesium.when(Cesium.sampleTerrain(terrainProvider, 9, terrainSamplePositions), sampleTerrainSuccess);
}
var show = true;
function toggleMeasureBox() {
    var measureBox = document.getElementById('measureBox');
    var profile = document.getElementById('profileBox');
    var cb_profile = document.getElementById('cb_profile');
    var cb_mouseControl = document.getElementById('cb_mouseControl');
    if (show) {
        console.log('show: ' + show);
        measureBox.className = 'show';
        startDrawing();
    }
    else {
        console.log('show: ' + show);
        measureBox.className = 'hide';
        profile.className = 'hide';
        cb_profile.checked = false;
        cb_mouseControl.checked = true;
        toggleMouse(true);
        clear();
        clearAll();
        stopDrawing();
    }
    show = !show;
}
