from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  

model = load_model("python/models/forgery_detection_model.h5")

def preprocess_image(image_file):
    image = Image.open(image_file).convert("RGB")
    image = image.resize((224, 224))  # size as per your CNN input
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.route("/upload", methods=["POST"])
def upload_invoice():
    if "invoice" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["invoice"]
    image = preprocess_image(file)
    prediction = model.predict(image)[0]
    
    confidence = float(np.max(prediction))
    is_genuine = bool(np.argmax(prediction) == 0)  # 0: Genuine, 1: Forged (adjust as per your model)

    return jsonify({
        "isGenuine": is_genuine,
        "confidence": confidence,
        "invoiceId": file.filename
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
