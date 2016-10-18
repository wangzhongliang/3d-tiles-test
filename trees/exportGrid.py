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
##        print path+' 目录已存在'
        return False

arcpy.env.workspace = r"F:\data\tree\workspace"
gridlowshp = "F:/data/tree/gridlow.shp"
count = 0
gridlow = arcpy.da.SearchCursor(gridlowshp,('Id','SHAPE@','lon','lat'))
for grid in gridlow:
    mkpath='F:/data/tree/workspace/gridlowID_'+'%d'%grid[0]
    mkdir(mkpath)
    print('gridlowID_{0}:'.format(grid[0]))
    centerX = grid[1].centroid.X
    centerY = grid[1].centroid.Y
    gridTable = {}
    gridTable['gridID'] = grid[0]
    gridTable['centerX'] = centerX
    gridTable['centerY'] = centerY
    gridTable['lon'] = grid[2]
    gridTable['lat'] = grid[3]

    str = json.dumps(gridTable)
    gdfile = open(mkpath+'/gridTable.json','w')
    gdfile.write(str)
    print('Save to '+mkpath+'/gridTable.json')
    print(str)
    gdfile.close() 
    ##下面代码用于该低尺度网格下中尺度tree导出    
    gridmidshp = "F:/data/tree/gridmid2.shp"
    count2 = 0
    gridmid = arcpy.da.SearchCursor(gridmidshp,('Id','SHAPE@','lon','lat'),""""Id_1"={0}""".format(grid[0]))
    for grid in gridmid:
        mkpath2=mkpath+'/gridmidID_'+'%d'%grid[0]
        mkdir(mkpath2)
        print('\tgridmidID_{0}:'.format(grid[0]))
        centerX = grid[1].centroid.X
        centerY = grid[1].centroid.Y
        gridTable = {}
        gridTable['gridID'] = grid[0]
        gridTable['centerX'] = centerX
        gridTable['centerY'] = centerY
        gridTable['lon'] = grid[2]
        gridTable['lat'] = grid[3]

        str = json.dumps(gridTable)
        gdfile = open(mkpath2+'/gridTable.json','w')
        gdfile.write(str)
        print('Save to '+mkpath2+'/gridTable.json')
        print(str)
        gdfile.close()
        ##下面代码用于该中尺度网格下高尺度tree导出    
        gridhighshp = "F:/data/tree/gridhigh2.shp"
        count3 = 0
        gridhigh = arcpy.da.SearchCursor(gridhighshp,('Id_1','SHAPE@','lon','lat'),""""Id"={0}""".format(grid[0]))
        for grid in gridhigh:
            mkpath3=mkpath2+'/gridhighID_'+'%d'%grid[0]
            mkdir(mkpath3)
            print('\t\tgridhighID_{0}:'.format(grid[0]))
            centerX = grid[1].centroid.X
            centerY = grid[1].centroid.Y
            gridTable = {}
            gridTable['gridID'] = grid[0]
            gridTable['centerX'] = centerX
            gridTable['centerY'] = centerY
            gridTable['lon'] = grid[2]
            gridTable['lat'] = grid[3]

            str = json.dumps(gridTable)
            gdfile = open(mkpath3+'/gridTable.json','w')
            gdfile.write(str)
            print('Save to '+mkpath3+'/gridTable.json')
            print(str)
            gdfile.close()
##            count3=count3+1
##            if count3>5:
##                break
##        count2=count2+1
##        if count2>5:
##            break
##    count=count+1
##    if count>5:
##        break


