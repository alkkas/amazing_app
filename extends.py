import string
import random
import qrcode

def genSomeCode(num):
    st = string.ascii_lowercase+string.digits
    out = ''
    for x in range(num):
        out += random.choice(st)
    return out

def genQr(link, img_name): # function by Shotgan
    pathToSave = 'static/qrs/'+img_name
    img = qrcode.make(link)
    img.save(pathToSave)
    return pathToSave