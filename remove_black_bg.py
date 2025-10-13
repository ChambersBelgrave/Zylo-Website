import cv2
import numpy as np
import os
import sys
try:
    # Minimal Tk just for file dialogs (no full window)
    import tkinter as tk
    from tkinter import filedialog, messagebox
except Exception as e:
    print("Tkinter is required for file selection dialogs.")
    sys.exit(1)

def remove_black_background(img_bgr, black_threshold=50, feather=5):
    """
    Remove black/near-black background from a BGR image.
    Returns an BGRA image with transparent background.

    Params:
      black_threshold: 0-255; higher = more aggressive background removal
      feather: >=0; Gaussian blur radius for softer edges
    """
    # Convert to RGB for straightforward thresholding on channels
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    # Create a mask where pixels are "near black" across all channels
    # You can also try HSV V channel, but this works well for clean blacks
    r, g, b = img_rgb[:, :, 0], img_rgb[:, :, 1], img_rgb[:, :, 2]
    near_black = (r < black_threshold) & (g < black_threshold) & (b < black_threshold)
    mask = np.uint8(near_black) * 255  # 255 where background

    # Clean small specks (morphology)
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_DILATE, kernel, iterations=1)

    # Feather the mask edge for smoother alpha (optional but nicer)
    if feather > 0:
        k = max(1, feather | 1)  # ensure odd
        mask = cv2.GaussianBlur(mask, (k, k), 0)

    # Alpha is inverse of background mask
    alpha = 255 - mask

    # Build BGRA output
    bgra = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = alpha
    return bgra

def main():
    root = tk.Tk()
    root.withdraw()

    filetypes = [
        ("Image files", "*.jpg *.jpeg *.png *.bmp *.tif *.tiff"),
        ("All files", "*.*"),
    ]
    in_path = filedialog.askopenfilename(
        title="Choose an image with a black background",
        filetypes=filetypes,
    )
    if not in_path:
        return

    # Read image
    img = cv2.imread(in_path, cv2.IMREAD_COLOR)
    if img is None:
        messagebox.showerror("Error", "Could not read the selected image.")
        return

    # Sensible defaults; tweak if needed
    BLACK_THRESHOLD = 50  # try 40–70 depending on your image
    FEATHER = 7           # try 3–15 for softer/harder edges

    out_img = remove_black_background(img, black_threshold=BLACK_THRESHOLD, feather=FEATHER)

    # Build a default output filename
    base, _ = os.path.splitext(os.path.basename(in_path))
    default_name = f"{base}_no-bg.png"

    out_path = filedialog.asksaveasfilename(
        title="Save transparent image as",
        defaultextension=".png",
        initialfile=default_name,
        filetypes=[("PNG image", "*.png")],
    )
    if not out_path:
        return

    success = cv2.imwrite(out_path, out_img)
    if not success:
        messagebox.showerror("Error", "Failed to save the output image.")
        return

    messagebox.showinfo("Done", f"Saved:\n{out_path}")

if __name__ == "__main__":
    main()
