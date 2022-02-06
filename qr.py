import qrcode

img_name = "habr.png"

def generate(data, img_name):
    img = qrcode.make(data)
    img.save(img_name)
    return img

generate("https://habr.com/", "habr.png")