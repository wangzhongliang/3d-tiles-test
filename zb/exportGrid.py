# -*- coding: cp936 -*-
import bpy
import json
import os

def mkdir(path):
 
    # 去除首位空格
    path=path.strip()
    # 去除尾部 \ 符号
    path=path.rstrip("\\")
 
    # 判断路径是否存在
    # 存在     True
    # 不存在   False
    isExists=os.path.exists(path)
 
    # 判断结果
    if not isExists:
        # 如果不存在则创建目录
        print path+' 创建成功'
        # 创建目录操作函数
        os.makedirs(path)
        return True
    else:
        # 如果目录存在则不创建，并提示目录已存在
        print path+' 目录已存在'
        return False
    
gridnum = 122
statstr = ''
for i in range(0,gridnum):
    bpy.ops.object.select_pattern(pattern="model_gridId_"+'%d'%i+"_*",extend=False)
    models = bpy.context.selected_objects
    if(len(models)==0):
        continue
    groupxmin = 100000000
    groupxmax = -100000000
    groupymin = 100000000
    groupymax = -100000000
    centerx = 0
    centery = 0
    count = 0
    mkpath='F:/data/ECNU/workspace/gridID_'+'%d'%i
    mkdir(mkpath)
    gridTable = {}
    gridTable['gridID'] = i
    for model in models:
        print(model)
        count = count+1
        x = model.location[0]
        y = model.location[1]
        centerx += x
        centery += y
        modelxmin = model.bound_box[0][0]+x
        modelymin = model.bound_box[0][1]+y
        modelxmax = model.bound_box[7][0]+x
        modelymax = model.bound_box[7][1]+y
        rotation = model.rotation_euler
        if(rotation[0]==1.5707964897155762):
            modelymin = -model.bound_box[6][2]+y
            modelymax = -model.bound_box[0][2]+y
        groupxmin = modelxmin if modelxmin<groupxmin else groupxmin
        groupxmax = modelxmax if modelxmax>groupxmax else groupxmax
        groupymin = modelymin if modelymin<groupymin else groupymin
        groupymax = modelymax if modelymax>groupymax else groupymax
    print(groupxmin)
    print(groupxmax)
    print(groupymin)
    print(groupymax)
    centerx =  centerx/count
    centery = centery/count
    width = groupxmax-groupxmin
    depth = groupymax-groupymin
    print(width)
    print(depth)
    print(centerx)
    print(centery)
##    bpy.ops.transform.translate(value=(-centerx, -centery, 0.0))
    bpy.ops.wm.collada_export(filepath=mkpath+"/"+'gridID_'+'%d'%i+".dae",selected=True,sort_by_name=True)
##    bpy.context.scene.collada_export(filepath=mkpath+"/"+'gridID_'+'%d'%i+".dae",selected=True,sort_by_name=True)
    gridTable['buildingCount'] = count
    gridTable['RTCx'] = centerx
    gridTable['RTCy'] = centery
    gridTable['width'] = width
    gridTable['depth'] = depth
    gridTable['height'] = 200
    jsonstr = json.dumps(gridTable)
    gdfile = open(mkpath+'/gridTable.json','w')
    gdfile.write(jsonstr)
    gdfile.close()
    statstr +='gridID_'+'%d'%i+'\t'+'%d'%count+'\n'

static = open('F:/data/ECNU/workspace/static','w')
static.write(statstr)
static.close()
