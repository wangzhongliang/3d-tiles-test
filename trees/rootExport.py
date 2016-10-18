# -*- coding: cp936 -*-
import arcpy
import json

arcpy.env.workspace = r"F:\data\tree\workspace"
treelowshp = "F:/data/tree/treelow2.shp"
count = 0
GCenterX = (13512921.604020+13516141.604020)/2
GCenterY = (3663721.686618+3660641.686618)/2
treelow = arcpy.da.SearchCursor(treelowshp,('full_id','SHAPE@','leaf_cycle','leaf_type','height','lon','lat'))     

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
for row in treelow:
    print row[0]
    full_id.append(row[0])
    leaf_cycle.append(row[2])
    leaf_type.append(row[3])
    height.append(row[4])
    lon.append(row[5])
    lat.append(row[6])
    localX.append(row[1].centroid.X-GCenterX)
    localY.append(row[1].centroid.Y-GCenterY)
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
btfile = open('F:/data/tree/workspace/batchTable.json','w')
btfile.write(str)
btfile.close()


