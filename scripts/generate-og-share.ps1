Add-Type -AssemblyName System.Drawing
$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.Clear([System.Drawing.Color]::FromArgb(0x1a, 0x23, 0x32))
$brushGold = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(0x8b, 0x73, 0x55))
$brushLight = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(0xf3, 0xf1, 0xec))
$fontTitle = [System.Drawing.Font]::new('Segoe UI', 42, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontSub = [System.Drawing.Font]::new('Segoe UI', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('City Center', $fontTitle, $brushLight, 60, 180)
$g.DrawString('C1 Markaz - Street 41 - B-17 Islamabad', $fontSub, $brushGold, 60, 270)
$g.DrawString('Shops - Flats - Offices for rent', $fontSub, $brushLight, 60, 320)
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(0x2d, 0x4a, 0x6f), 4)
$g.DrawLine($pen, 60, 420, 580, 420)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$out = Join-Path $root 'assets\og-share.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Wrote $out"
