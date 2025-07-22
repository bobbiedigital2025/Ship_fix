#!/usr/bin/env python3
"""
Icon Generator for Ship_fix PWA
Converts the base SVG icon to multiple PNG sizes required for the PWA manifest
"""

import os
import subprocess
import sys

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import cairosvg
        return True
    except ImportError:
        print("cairosvg not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "cairosvg"])
        import cairosvg
        return True

def generate_icon(svg_path, output_path, size):
    """Generate PNG icon from SVG at specified size"""
    try:
        import cairosvg
        cairosvg.svg2png(
            url=svg_path,
            write_to=output_path,
            output_width=size,
            output_height=size
        )
        print(f"✓ Generated {output_path} ({size}x{size})")
        return True
    except Exception as e:
        print(f"✗ Failed to generate {output_path}: {e}")
        return False

def main():
    """Main function to generate all required icons"""
    base_dir = "/workspaces/Ship_fix/public"
    svg_path = os.path.join(base_dir, "icon-base.svg")
    
    # Required icon sizes for PWA
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    if not os.path.exists(svg_path):
        print(f"Error: Base SVG not found at {svg_path}")
        return False
    
    # Check and install dependencies
    if not check_dependencies():
        print("Failed to install required dependencies")
        return False
    
    print("Generating PWA icons...")
    success_count = 0
    
    for size in sizes:
        output_path = os.path.join(base_dir, f"icon-{size}.png")
        if generate_icon(svg_path, output_path, size):
            success_count += 1
    
    print(f"\nGenerated {success_count}/{len(sizes)} icons successfully!")
    
    # Also generate favicon
    favicon_path = os.path.join(base_dir, "favicon.ico")
    temp_favicon_png = os.path.join(base_dir, "favicon-32.png")
    
    if generate_icon(svg_path, temp_favicon_png, 32):
        try:
            # Convert PNG to ICO if PIL is available
            from PIL import Image
            img = Image.open(temp_favicon_png)
            img.save(favicon_path, format='ICO', sizes=[(32, 32)])
            os.remove(temp_favicon_png)
            print("✓ Generated favicon.ico")
        except ImportError:
            print("PIL not available, keeping PNG favicon")
            os.rename(temp_favicon_png, os.path.join(base_dir, "favicon.png"))
    
    return True

if __name__ == "__main__":
    main()
