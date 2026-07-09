# ============================================================
#  Parrilla Don José - Servidor local para probar en PC y celular
#  Uso:  clic derecho sobre este archivo -> "Ejecutar con PowerShell"
#        (mejor si PowerShell está como Administrador)
#  Detener: Ctrl + C
# ============================================================
$puerto = 8000
$raiz = $PSScriptRoot
if (-not $raiz) { $raiz = (Get-Location).Path }

$mime = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'
  '.css'='text/css; charset=utf-8';   '.js'='application/javascript; charset=utf-8'
  '.svg'='image/svg+xml';             '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.png'='image/png';  '.gif'='image/gif'; '.webp'='image/webp'; '.ico'='image/x-icon'
  '.json'='application/json'; '.txt'='text/plain; charset=utf-8'
  '.woff'='font/woff'; '.woff2'='font/woff2'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$puerto/")
try {
  $listener.Start()
} catch {
  Write-Host ""
  Write-Host "No se pudo abrir el servidor para toda la red (falta permiso de Administrador)." -ForegroundColor Yellow
  Write-Host "Solución: cerrá esta ventana y abrí PowerShell COMO ADMINISTRADOR," -ForegroundColor Yellow
  Write-Host "o ejecutá una sola vez (como admin) este comando y volvé a intentar:" -ForegroundColor Yellow
  Write-Host "  netsh http add urlacl url=http://+:$puerto/ sddl=D:(A;;GX;;;WD)" -ForegroundColor Cyan
  Read-Host "Enter para salir"
  exit 1
}

$ips = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
  Select-Object -ExpandProperty IPAddress

Write-Host ""
Write-Host "  Servidor activo - carpeta: $raiz" -ForegroundColor Green
Write-Host "  ---------------------------------------------" -ForegroundColor DarkGray
Write-Host "  En esta PC:     http://localhost:$puerto" -ForegroundColor Green
foreach ($ip in $ips) {
  Write-Host "  En el celular:  http://$ip`:$puerto   (misma red WiFi)" -ForegroundColor Cyan
}
Write-Host "  ---------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Detener: Ctrl + C" -ForegroundColor DarkGray
Write-Host ""

while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $ruta = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($ruta -eq '/') { $ruta = '/index.html' }
    $archivo = Join-Path $raiz ($ruta.TrimStart('/') -replace '/', '\')
    if (Test-Path $archivo -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($archivo).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($archivo)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - no encontrado: $ruta")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
