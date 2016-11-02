# -*- coding: cp936 -*-
import arcpy
import numpy
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

arcpy.env.workspace = r"F:\data\ECNU"  
input = "F:/data/ECNU/zbbuilding_sj.shp"
table = arcpy.da.TableToNumPyArray(input,('full_id','name','int_name','building','gridID'))
##print(json.dumps(obj,indent=4))
gridNum = 122
for i in range(0,gridNum):
    gridmodels = table[table['gridID']==i]
    grid = '%d'%i
    batchTable = {}
    
    full_id = []
    name = []
    building = []
    int_name = []
    gridID = []
    
    mkpath='F:/data/ECNU/workspace/gridID_'+grid
    mkdir(mkpath)
    for row in gridmodels:
        full_id.append(row['full_id'])
        name.append(row['name'])
        building.append(row['building'])
        int_name.append(row['int_name'])
        gridID.append(int(row['gridID']))
        
    batchTable['full_id']=full_id
    batchTable['name']=name
    batchTable['building']=building
    batchTable['int_name']=int_name
    batchTable['gridID']=gridID

##    print(batchTable)
    str = json.dumps(batchTable,encoding="utf-8")

    btfile = open(mkpath+'/batchTable.json','w')
    btfile.write(str)
    btfile.close()



 
