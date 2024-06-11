import requests
import cv2
import numpy as np
import base64

# Örnek resim yolu
image_path = "C:/Users/Aylin/Documents/GitHub/ceng-407-408-2023-2024-CreatInk/backend/test.jpg"

# Resmi oku
image = cv2.imread(image_path)

# Resmi POST isteği ile gönder
url = "http://192.168.1.109:5000/processImage"
files = {"image": open(image_path, "rb")}
response = requests.post(url, files=files)

# Sunucudan gelen yanıtı kontrol et
if response.status_code == 200: 
    # Base64 formatında gelen resmi decode et
    gray_image_base64 = response.json()["image"]
    gray_image_bytes = base64.b64decode(gray_image_base64)
    
    # Bytes'i Numpy dizisine dönüştür ve resmi göster
    gray_image_np = np.frombuffer(gray_image_bytes, dtype=np.uint8)
    gray_image = cv2.imdecode(gray_image_np, cv2.IMREAD_GRAYSCALE)
    cv2.imshow("Gri Resim", gray_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print("Resim işleme başarısız:", response.text)