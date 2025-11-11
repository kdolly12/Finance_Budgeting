import { useState } from "react";
import { useSavings } from "../context/SavingsProvider";
import Tesseract from "tesseract.js";
import "./ExpenseForm.css";

// Preprocess image using HTML Canvas (grayscale + contrast + threshold)
const preprocessImage = (imageData: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Grayscale + simple normalization + threshold
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const val = avg < 150 ? 0 : 255; // Adjust threshold if needed
        data[i] = data[i + 1] = data[i + 2] = val;
      }

      ctx.putImageData(imgData, 0, 0);

      resolve(canvas.toDataURL());
    };
  });
};

// Extract numeric total/amount from OCR text
const extractAmount = (text: string): number | null => {
  const patterns = [
    /\b(?:total|amount|grand\s*total|payable|balance)[^\d]*(\d{2,7}(?:\.\d{1,2})?)\b/i,
    /₹\s*(\d{2,7}(?:\.\d{1,2})?)/i,
    /rs\.?\s*(\d{2,7}(?:\.\d{1,2})?)/i,
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match) return parseFloat(match[1]);
  }
  const allNumbers = text.match(/\d{2,7}(?:\.\d{1,2})?/g);
  if (allNumbers) return Math.max(...allNumbers.map(Number));
  return null;
};

// Simple receipt validation
const isReceipt = (text: string): boolean => {
  const keywords = ["total", "amount", "receipt", "bill", "tax", "invoice", "store", "date"];
  const found = keywords.filter((k) => new RegExp(k, "i").test(text));
  return found.length >= 2;
};

export default function ExpenseForm() {
  const { addExpense } = useSavings();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"daily" | "monthly">("daily");
  const [photo, setPhoto] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("❌ Only PNG, JPG, or JPEG files are allowed!");
      return;
    }

    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async () => {
      const imgData = reader.result as string;
      setPhoto(imgData);

      try {
        // Preprocess image for better OCR
        const processedImg = await preprocessImage(imgData);

        const {
          data: { text },
        } = await Tesseract.recognize(processedImg, "eng", {
          tessedit_char_whitelist:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789₹.:,/-",
        });

        if (!isReceipt(text)) {
          alert("⚠️ This doesn’t look like a valid receipt. Try again.");
          setPhoto(undefined);
          setFileName(undefined);
          setLoading(false);
          return;
        }

        const extracted = extractAmount(text);
        if (extracted) setAmount(extracted);

        const firstLine = text.split("\n").find((line) => line.trim().length > 3);
        if (firstLine) setTitle(firstLine.trim().slice(0, 30));
      } catch (err) {
        console.error(err);
        alert("❌ Error reading the receipt. Try again.");
        setPhoto(undefined);
        setFileName(undefined);
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setPhoto(undefined);
    setFileName(undefined);
    setAmount("");
    setTitle("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      alert("Please provide title and amount before adding.");
      return;
    }

    addExpense({
      id: Date.now().toString(),
      title,
      amount: Number(amount),
      type,
      photoUrl: photo,
    });

    setTitle("");
    setAmount("");
    setType("daily");
    setPhoto(undefined);
    setFileName(undefined);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="type-group">
        <label>
          <input
            type="radio"
            value="daily"
            checked={type === "daily"}
            onChange={() => setType("daily")}
          />{" "}
          Daily
        </label>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={type === "monthly"}
            onChange={() => setType("monthly")}
          />{" "}
          Monthly
        </label>
      </div>

      <div className="file-group">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handlePhoto}
        />
        {fileName && (
          <button type="button" onClick={handleRemoveFile}>
            Remove File
          </button>
        )}
      </div>

      {photo && (
        <div className="photo-preview">
          <p>Preview:</p>
          <img src={photo} alt="Receipt Preview" />
        </div>
      )}

      {loading && <p className="loading">🧠 Reading receipt and extracting total amount...</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Add Expense"}
      </button>
    </form>
  );
}
