# -*- coding: cp936 -*-
import arcpy
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

arcpy.env.workspace = r"F:\data\tree\workspace"
gridlowshp = "F:/data/tree/gridlow.shp"
treemidshp = "F:/data/tree/treemid3.shp"
count = 0
##arcpy.AddField_management(input, "lon", "DOUBLE")
##spatref = arcpy.SpatialReference(4326) #WGS 84 
##arcpy.AddGeometryAttributes_management(input,"POINT_X_Y_Z_M","","",spatref)
GCenterX = (13512921.604020+13516141.604020)/2
GCenterY = (3663721.686618+3660641.686618)/2
gridlow = arcpy.da.SearchCursor(gridlowshp,('Id','SHAPE@'))
for grid in gridlow:
    mkpath='F:/data/tree/workspace/gridlowID_'+'%d'%grid[0]
    mkdir(mkpath)
    print('gridlowID_{0}:'.format(grid[0]))
    centerX = grid[1].centroid.X
    centerY = grid[1].centroid.Y
    batchTable = {}
    full_id=[]
    leaf_cycle=[]
    leaf_type=[]
    height=[]
    lon=[]
    lat=[]
    localX=[]
    localY=[]
    globalX = []
    globalY = []
    treemid = arcpy.da.SearchCursor(treemidshp,('full_id','SHAPE@','leaf_cycle','leaf_type','height','lon','lat'),""""Id_1"={0}""".format(grid[0]))
       
    for row in treemid:
        print row[0]
        full_id.append(row[0])
        leaf_cycle.append(row[2])
        leaf_type.append(row[3])
        height.append(row[4])
        lon.append(row[5])
        lat.append(row[6])
        localX.append(row[1].centroid.X-centerX)
        localY.append(row[1].centroid.Y-centerY)
        globalX.append(row[1].centroid.X-GCenterX)
        globalY.append(row[1].centroid.Y-GCenterY)
    batchTable['full_id'] = full_id
    batchTable['leaf_cycle'] = leaf_cycle
    batchTable['leaf_type'] = leaf_type
    batchTable['height'] = height
    batchTable['lon'] = lon
    batchTable['lat'] = lat
    batchTable['localX'] = localX
    batchTable['globalX'] = globalX
    batchTable['globalY'] = globalY

    str = json.dumps(batchTable)
    btfile = open(mkpath+'/batchTable.json','w')
    btfile.write(str)
    btfile.close() 
    ##下面代码用于该低尺度网格下中尺度tree导出    
    gridmidshp = "F:/data/tree/gridmid2.shp"
    treehighshp = "F:/data/tree/treehigh3.shp"
    count2 = 0
    gridmid = arcpy.da.SearchCursor(gridmidshp,('Id','SHAPE@'),""""Id_1"={0}""".format(grid[0]))
    for grid in gridmid:
        mkpath2=mkpath+'/gridmidID_'+'%d'%grid[0]
        mkdir(mkpath2)
        print('\tgridmidID_{0}:'.format(grid[0]))
        centerX = grid[1].centroid.X
        centerY = grid[1].centroid.Y
        batchTable = {}
        full_id=[]
        leaf_cycle=[]
        leaf_type=[]
        height=[]
        lon=[]
        lat=[]
        localX=[]
        localY=[]
        globalX = []
        globalY = []
        treehigh = arcpy.da.SearchCursor(treehighshp,('full_id','SHAPE@','leaf_cycle','leaf_type','height','lon','lat'),""""Id"={0}""".format(grid[0]))
           
        for row in treehigh:
            print('\t'+row[0])
            full_id.append(row[0])
            leaf_cycle.append(row[2])
            leaf_type.append(row[3])
            height.append(row[4])
            lon.append(row[5])
            lat.append(row[6])
            localX.append(row[1].centroid.X-centerX)
            localY.append(row[1].centroid.Y-centerY)
            globalX.append(row[1].centroid.X-GCenterX)
            globalY.append(row[1].centroid.Y-GCenterY)
        batchTable['full_id'] = full_id
        batchTable['leaf_cycle'] = leaf_cycle
        batchTable['leaf_type'] = leaf_type
        batchTable['height'] = height
        batchTable['lon'] = lon
        batchTable['lat'] = lat
        batchTable['localX'] = localX
        batchTable['localY'] = localY
        batchTable['globalX'] = globalX
        batchTable['globalY'] = globalY

        str = json.dumps(batchTable)
        btfile = open(mkpath2+'/batchTable.json','w')
        btfile.write(str)
        btfile.close()
        ##下面代码用于该中尺度网格下高尺度tree导出    
        gridhighshp = "F:/data/tree/gridhigh2.shp"
        treeAllshp = "F:/data/tree/treeAll3.shp"
        count3 = 0
        gridhigh = arcpy.da.SearchCursor(gridhighshp,('Id_1','SHAPE@'),""""Id"={0}""".format(grid[0]))
        for grid in gridhigh:
            mkpath3=mkpath2+'/gridhighID_'+'%d'%grid[0]
            mkdir(mkpath3)
            print('\t\tgridhighID_{0}:'.format(grid[0]))
            centerX = grid[1].centroid.X
            centerY = grid[1].centroid.Y
            batchTable = {}
            full_id=[]
            leaf_cycle=[]
            leaf_type=[]
            height=[]
            lon=[]
            lat=[]
            localX=[]
            localY=[]
            globalX = []
            globalY = []
            treeAll = arcpy.da.SearchCursor(treeAllshp,('full_id','SHAPE@','leaf_cycle','leaf_type','height','lon','lat'),""""Id"={0}""".format(grid[0]))
               
            for row in treeAll:
                print('\t\t'+row[0])
                full_id.append(row[0])
                leaf_cycle.append(row[2])
                leaf_type.append(row[3])
                height.append(row[4])
                lon.append(row[5])
                lat.append(row[6])
                localX.append(row[1].centroid.X-centerX)
                localY.append(row[1].centroid.Y-centerY)
                globalX.append(row[1].centroid.X-GCenterX)
                globalY.append(row[1].centroid.Y-GCenterY)
            batchTable['full_id'] = full_id
            batchTable['leaf_cycle'] = leaf_cycle
            batchTable['leaf_type'] = leaf_type
            batchTable['height'] = height
            batchTable['lon'] = lon
            batchTable['lat'] = lat
            batchTable['localX'] = localX
            batchTable['localY'] = localY
            batchTable['globalX'] = globalX
            batchTable['globalY'] = globalY

            str = json.dumps(batchTable)
            btfile = open(mkpath3+'/batchTable.json','w')
            btfile.write(str)
            btfile.close()
            count3=count3+1
##            if count3>5:
##                break
##        count2=count2+1
##        if count2>5:
##            break
##    count=count+1
##    if count>5:
##        break


