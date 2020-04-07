import re

f = open("Roadaccidents_text.txt", "r")

videoOnly = "["
videoAndObjDet = "["
first = True

for i in f:
    if ("videoOnly" in i):
        print("vidonly")
        m = re.match("{'videoOnly': {'\(\)': {([0-9]+): ([0-9]+).([0-9]+e*-*[0-9]*)}}}", i)
        if m:
            x = m.group(1)
            y = m.group(2) + "." + m.group(3)

            if first:
                first = False
            else: 
                videoOnly += ", "

            newx = "{\"x\": " + str(x) + ", \"y\":" + str(y) + "}"

            videoOnly += newx
            print(newx)
    else:
        print("vidandobj")
        m = re.match("{'videoAndObjDet': {'\(\)': {([0-9]+): ([0-9]+).([0-9]+e*-*[0-9]*)}}}", i)
        if m:
            x = m.group(1)
            y = m.group(2) + "." + m.group(3)

            newx = "{\"x\": " + str(x) + ", \"y\":" + str(y) + "}"

            videoAndObjDet += newx
            print(newx)

videoOnly += "]"
videoAndObjDet += "]"

if (videoOnly != "[]") : 
    print("{\"videoOnly\": " + str(videoOnly) + "}")
if (videoAndObjDet != "[]") :
    print("{\"videoAndObjDet\": " + str(videoAndObjDet) + "}")
f.close()