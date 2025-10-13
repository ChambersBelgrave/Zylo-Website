import cv2
import numpy as np
import os
import sys
try:
    import tkinter as tk
    from tkinter import filedialog, messagebox
except Exception as e:
    print("Tkinter is required for file selection dialogs.")
    sys.exit(1)

def remove_white_background(img_bgr, white_threshold=200, feather=5):
    """
    Remove white/near-white background from a BGR image.
    Returns a BGRA image with transparent background.

    Params:
      white_threshold: 0–255; lower = more aggressive background removal
      feather: >=0; Gaussian blur radius for softer edges
    """
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    # Split channels
    r, g, b = img_rgb[:, :, 0], img_rgb[:, :, 1], img_rgb[:, :, 2]

    # Pixels "near white" across all channels
    near_white = (r > white_threshold) & (g > white_threshold) & (b > white_threshold)
    mask = np.uint8(near_white) * 255  # 255 where background is white

    # Morphological cleanup
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_DILATE, kernel, iterations=1)

    # Feather edges for smooth alpha
    if feather > 0:
        k = max(1, feather | 1)  # ensure odd
        mask = cv2.GaussianBlur(mask, (k, k), 0)

    # Alpha = inverse of mask (transparent where white)
    alpha = 255 - mask

    # Combine into BGRA
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
        title="Choose an image with a white background",
        filetypes=filetypes,
    )
    if not in_path:
        return

    img = cv2.imread(in_path, cv2.IMREAD_COLOR)
    if img is None:
        messagebox.showerror("Error", "Could not read the selected image.")
        return

    # Adjust these defaults as needed
    WHITE_THRESHOLD = 200  # try 180–240 depending on your image
    FEATHER = 7            # try 3–15 for softer/harder edges

    out_img = remove_white_background(img, white_threshold=WHITE_THRESHOLD, feather=FEATHER)

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
