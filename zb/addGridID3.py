import bpy
import mathutils
from sympy import Point, Polygon
bpy.ops.object.select_pattern(pattern="model_*",extend=False)
models = bpy.context.selected_objects
bpy.ops.object.select_pattern(pattern="gridID_*",extend=False)
shps = bpy.context.selected_objects

def calArea2(modelxmin,modelxmax,modelymin,modelymax,shpxmin,shpxmax,shpymin,shpymax):
    modelv = [(modelxmin,modelymin),(modelxmin,modelymax),(modelxmax,modelymax),(modelxmax,modelymin)]
    shpv = [(shpxmin,shpymin),(shpxmin,shpymax),(shpxmax,shpymax),(shpxmax,shpymin)]
    insidePlist = []
    for mv in modelv:
        f1 = mathutils.geometry.intersect_point_tri_2d(mv, shpv[0], shpv[1], shpv[2])
        f2 = mathutils.geometry.intersect_point_tri_2d(mv, shpv[0], shpv[2], shpv[3])
        if(abs(f1)==1 or abs(f2)==1):
            insidePlist.append(mv)
    for sv in shpv:
        f3 = mathutils.geometry.intersect_point_tri_2d(sv, modelv[0], modelv[1], modelv[2])
        f4 = mathutils.geometry.intersect_point_tri_2d(sv, modelv[0], modelv[2], modelv[3])
        if(abs(f3)==1 or abs(f4)==1):
            insidePlist.append(sv)
    p1, p2, p3, p4 = map(Point, [(modelxmin, modelymin), (modelxmin, modelymax), (modelxmax, modelymax), (modelxmax, modelymin)])
    poly1 = Polygon(p1, p2, p3, p4)
    p5, p6, p7, p8 = map(Point, [(shpxmin, shpymin), (shpxmin, shpymax), (shpxmax, shpymax), (shpxmax, shpymin)])
    poly2 = Polygon(p5, p6, p7, p8)
    plist = poly1.intersection(poly2)
    if(len(plist)==0):
        intersection = Polygon(insidePlist[0],insidePlist[1],insidePlist[2],insidePlist[3])
        area = abs(intersection.area)
        return area
    elif(len(plist)==2):
        v1, v2 = map(Point, plist)
        try:
            intersection = Polygon(v2, v1, insidePlist[0],insidePlist[1])
            area = abs(intersection.area)
            return area
        except:
            try:
                intersection = Polygon(v1, v2, insidePlist[0],insidePlist[1])
                area = abs(intersection.area)
                return area
            except:
                try:
                    intersection = Polygon(v1, insidePlist[1], v2, insidePlist[0])
                    area = abs(intersection.area)
                    return area
                except:
                    print('plist==2 error')
    elif(len(plist)==4):
        v1, v2, v3, v4 = map(Point, plist)
        try:
            intersection = Polygon(v1, v2, v3, v4)
            area = abs(intersection.area)
            return area
        except:
            try:
                intersection = Polygon(v2, v1, v3, v4)
                area = abs(intersection.area)
                return area
            except:
                print('plist==4 error')      
    return False

for model in models:
    print(model)
    x = model.location[0]
    y = model.location[1]
    modelxmin = model.bound_box[0][0]+x
    modelymin = model.bound_box[0][1]+y
    modelxmax = model.bound_box[7][0]+x
    modelymax = model.bound_box[7][1]+y
    rotation = model.rotation_euler
    maxArea = 0
    if(rotation[0]==1.5707964897155762):
        modelymin = -model.bound_box[6][2]+y
        modelymax = -model.bound_box[0][2]+y
    modelArea = (modelxmax-modelxmin)*(modelymax-modelymin)
    for shp in shps:
        shpxmin = shp.bound_box[0][0]-1.88266
        shpymin = shp.bound_box[0][1]-127.10209
        shpxmax = shp.bound_box[7][0]-1.88266
        shpymax = shp.bound_box[7][1]-127.10209
        shpArea = (shpxmax-shpxmin)*(shpymax-shpymin)
        if(modelxmin>shpxmax or modelxmax<shpxmin or modelymin>shpymax or modelymax<shpymin):
            continue
        else:
            print(shp)
            area = calArea2(modelxmin,modelxmax,modelymin,modelymax,shpxmin,shpxmax,shpymin,shpymax)
            if(area):
                print('area {0}'.format(area))
                if((area/modelArea)>=(maxArea/shpArea) and (area/modelArea)<1 and (area/modelArea)>0.9):
                    maxArea = area
                    newname = 'model_'+shp.name
                    print(newname)
                    model.name = newname
            else:
                raise Exception('area=False')
