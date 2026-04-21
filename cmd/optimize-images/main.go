package main

import (
	"fmt"
	"image"
	"image/jpeg"
	_ "image/png"
	"os"
	"path/filepath"
	"strings"
)

const (
	sourceRoot      = "static/images"
	destinationRoot = "static/optimized/images"
	maxDimension    = 1600
	jpegQuality     = 72
)

func main() {
	var processed int

	err := filepath.Walk(sourceRoot, func(srcPath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		ext := strings.ToLower(filepath.Ext(srcPath))
		if ext != ".jpg" && ext != ".jpeg" {
			return nil
		}

		relPath, err := filepath.Rel(sourceRoot, srcPath)
		if err != nil {
			return err
		}

		dstPath := filepath.Join(destinationRoot, relPath)
		if err := optimizeJPEG(srcPath, dstPath); err != nil {
			return fmt.Errorf("%s: %w", srcPath, err)
		}

		processed++
		return nil
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "image optimization failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("optimized %d image(s)\n", processed)
}

func optimizeJPEG(srcPath, dstPath string) error {
	srcFile, err := os.Open(srcPath)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	img, _, err := image.Decode(srcFile)
	if err != nil {
		return err
	}

	resized := resizeToFit(img, maxDimension)

	if err := os.MkdirAll(filepath.Dir(dstPath), 0o755); err != nil {
		return err
	}

	dstFile, err := os.Create(dstPath)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	return jpeg.Encode(dstFile, resized, &jpeg.Options{Quality: jpegQuality})
}

func resizeToFit(src image.Image, limit int) image.Image {
	bounds := src.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	if width <= limit && height <= limit {
		return src
	}

	targetWidth := width
	targetHeight := height
	if width >= height {
		targetWidth = limit
		targetHeight = int(float64(height) * (float64(limit) / float64(width)))
	} else {
		targetHeight = limit
		targetWidth = int(float64(width) * (float64(limit) / float64(height)))
	}

	if targetWidth < 1 {
		targetWidth = 1
	}
	if targetHeight < 1 {
		targetHeight = 1
	}

	dst := image.NewRGBA(image.Rect(0, 0, targetWidth, targetHeight))
	for y := 0; y < targetHeight; y++ {
		srcY := bounds.Min.Y + (y*height)/targetHeight
		for x := 0; x < targetWidth; x++ {
			srcX := bounds.Min.X + (x*width)/targetWidth
			dst.Set(x, y, src.At(srcX, srcY))
		}
	}

	return dst
}
