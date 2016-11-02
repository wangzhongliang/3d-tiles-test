import bpy
import mathutils
from sympy import Point, Polygon
##bpy.ops.object.select_pattern(pattern="model_*",extend=False)
bpy.ops.object.select_pattern(pattern="model_gridID_121_w375224849",extend=False)
models = bpy.context.selected_objects
len(models)
##bpy.ops.object.select_pattern(pattern="gridID_*",extend=False)
bpy.ops.object.select_pattern(pattern="gridID_121_w375224849",extend=False)
shps = bpy.context.selected_objects
len(shps)

def calArea2(modelxmin,modelxmax,modelymin,modelymax,shpxmin,shpxmax,shpymin,shpymax):
    p1, p2, p3, p4 = map(Point, [(modelxmin, modelymin), (modelxmin, modelymax), (modelxmax, modelymax), (modelxmax, modelymin)])
    poly1 = Polygon(p1, p2, p3, p4)
    p5, p6, p7, p8 = map(Point, [(shpxmin, shpymin), (shpxmin, shpymax), (shpxmax, shpymax), (shpxmax, shpymin)])
    poly2 = Polygon(p5, p6, p7, p8)
    intersection = poly1.intersection(poly2)
    area = abs(intersection.area)

def calArea(modelxmin,modelxmax,modelymin,modelymax,shpxmin,shpxmax,shpymin,shpymax):
    area = 0
    if(modelxmin<=shpxmax and modelxmin>=shpxmin and modelymin<=shpymax and modelymin>=shpymin):
        a = Vector((modelxmin, modelymin))
        b = Vector((modelxmin,modelymax))
        c = Vector((shpxmin,shpymax))
        d = Vector((shpxmax,shpymax))
        v1 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        a = Vector((modelxmin, modelymin))
        b = Vector((modelxmax,modelymin))
        c = Vector((shpxmax,shpymin))
        d = Vector((shpxmax,shpymax))
        print(a)
        print(b)
        print(c)
        print(d)
        v2 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        print(v1)
        print(v2)
        if(a and b and c and d and v1 and v2):
            area1 = mathutils.geometry.area_tri(v1, v2, Vector((modelxmin, modelymin)))
            area2 = mathutils.geometry.area_tri(v1, v2, Vector((shpxmax,shpymax)))
            area = area1+area2
    elif(modelxmax>=shpxmin and modelxmax<=shpxmax and modelymin<=shpymax and modelymin>=shpymin):
        a = Vector((modelxmax, modelymin))
        b = Vector((modelxmax,modelymax))
        c = Vector((shpxmin,shpymax))
        d = Vector((shpxmax,shpymax))
        v1 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        a = Vector((modelxmin, modelymin))
        b = Vector((modelxmax,modelymin))
        c = Vector((shpxmin,shpymin))
        d = Vector((shpxmin,shpymax))
        print(a)
        print(b)
        print(c)
        print(d)
        v2 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        print(v1)
        print(v2)
        if(a and b and c and d and v1 and v2):
            area1 = mathutils.geometry.area_tri(v1, v2, Vector((modelxmax, modelymin)))
            area2 = mathutils.geometry.area_tri(v1, v2, Vector((shpxmin,shpymax)))
            area = area1+area2
    elif(modelxmax>=shpxmin and modelxmax<=shpxmax and modelymax<=shpymax and modelymax>=shpymin):
        a = Vector((modelxmin, modelymax))
        b = Vector((modelxmax,modelymax))
        c = Vector((shpxmin,shpymin))
        d = Vector((shpxmin,shpymax))
        v1 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        a = Vector((modelxmax, modelymax))
        b = Vector((modelxmax,modelymin))
        c = Vector((shpxmin,shpymin))
        d = Vector((shpxmax,shpymin))
        print(a)
        print(b)
        print(c)
        print(d)
        v2 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        print(v1)
        print(v2)
        if(a and b and c and d and v1 and v2):
            area1 = mathutils.geometry.area_tri(v1, v2, Vector((modelxmax, modelymax)))
            area2 = mathutils.geometry.area_tri(v1, v2, Vector((shpxmin,shpymin)))
            area = area1+area2
    elif(modelxmin>=shpxmin and modelxmin<=shpxmax and modelymax<=shpymax and modelymax>=shpymin):
        a = Vector((modelxmin, modelymax))
        b = Vector((modelxmax,modelymax))
        c = Vector((shpxmax,shpymin))
        d = Vector((shpxmax,shpymax))
        v1 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        a = Vector((modelxmin, modelymax))
        b = Vector((modelxmin,modelymin))
        c = Vector((shpxmin,shpymin))
        d = Vector((shpxmax,shpymin))
        print(a)
        print(b)
        print(c)
        print(d)
        v2 = mathutils.geometry.intersect_line_line_2d(a,b,c,d)
        print(v1)
        print(v2)
        if(a and b and c and d and v1 and v2):
            area1 = mathutils.geometry.area_tri(v1, v2, Vector((modelxmin, modelymax)))
            area2 = mathutils.geometry.area_tri(v1, v2, Vector((shpxmax,shpymin)))
            area = area1+area2
    return area

for model in models:
    x = model.location[0]
    y = model.location[1]
    modelxmin = model.bound_box[0][0]+x
    modelymin = model.bound_box[0][1]+y
    modelxmax = model.bound_box[7][0]+x
    modelymax = model.bound_box[7][1]+y
    rotation = model.rotation_euler
    maxArea = 0
    minArea = 100000
    if(rotation[0]==1.5707964897155762):
        modelymin = -model.bound_box[6][2]+y
        modelymax = -model.bound_box[0][2]+y
    modelArea = (modelxmax-modelxmin)*(modelymax-modelymin)
    for shp in shps:
        shpxmin = shp.bound_box[0][0]-1.88266
        shpymin = shp.bound_box[0][1]-127.10209
        shpxmax = shp.bound_box[7][0]-1.88266
        shpymax = shp.bound_box[7][1]-127.10209
        if(modelxmin>shpxmax or modelxmax<shpxmin or modelymin>shpymax or modelymax<shpymin):
            continue
        else:
            print(model)
            print(shp)
            area = calArea(modelxmin,modelxmax,modelymin,modelymax,shpxmin,shpxmax,shpymin,shpymax)
            print('area {0}'.format(area))
            if(area>maxArea):
                newname = 'model_'+shp.name
                print(newname)
                model.name = newname
