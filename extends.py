import string
import random
import qrcode
import os
from hashlib import sha256

def genSomeCode(num):
    st = string.ascii_lowercase+string.digits
    out = ''
    for x in range(num):
        out += random.choice(st)
    return out

def genQr(link, img_name): # function by Shotgan
    pathToSave = 'static/qrs/'+img_name
    if not os.path.exists('static/qrs/'): os.makedirs('static/qrs/') 
    img = qrcode.make(link)
    img.save(pathToSave)
    return pathToSave

def genHash(st):
    return sha256(st.encode('utf-8')).hexdigest()