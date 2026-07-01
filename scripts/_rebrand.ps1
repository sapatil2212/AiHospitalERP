$ErrorActionPreference = "Stop"
$root = "e:\Full Stack Projects\AiHospitalERP"
$dirs = @("src","backend","scripts","prisma")
$exts = @("*.ts","*.tsx","*.js","*.jsx","*.json","*.css","*.md","*.html","*.mjs")
$enc = New-Object System.Text.UTF8Encoding($false)

$files = @()
foreach ($d in $dirs) {
  $p = Join-Path $root $d
  if (Test-Path $p) {
    $files += Get-ChildItem -Path $p -Recurse -File -Include $exts -ErrorAction SilentlyContinue
  }
}

$changed = @()
foreach ($f in $files) {
  if ($f.FullName -like "*\_rebrand.ps1") { continue }
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $o = $c
  # Logo asset paths (switch to new SVG assets)
  $c = $c.Replace("/logo/medinexplus-logo-normal.png", "/logo/aihospitalerp-logo-normal.svg")
  $c = $c.Replace("/logo/medinexplus-logo-white.png",  "/logo/aihospitalerp-logo-white.svg")
  $c = $c.Replace("/logo/favicon-icon.png",            "/logo/aihospitalerp-icon.svg")
  # Domains / emails
  $c = $c.Replace("medinexplus.com", "aihospitalerp.com")
  $c = $c.Replace("medinex-test.com", "aihospitalerp-test.com")
  # Brand names
  $c = $c.Replace("MediNexPlus", "AiHospitalERP")
  $c = $c.Replace("MediNex+", "AiHospitalERP")
  if ($c -ne $o) {
    [System.IO.File]::WriteAllText($f.FullName, $c, $enc)
    $changed += $f.FullName
  }
}
Write-Output "CHANGED_COUNT=$($changed.Count)"
$changed | ForEach-Object { Write-Output $_ }
