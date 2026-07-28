$files = Get-ChildItem -Path 'd:\projects\travelsite' -Filter '*.html'
foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw
  $newContent = $content -replace 'site-data\.js\?v=5', 'site-data.js?v=6'
  if ($content -ne $newContent) {
    [System.IO.File]::WriteAllText($f.FullName, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated: $($f.Name)"
  }
}
Write-Host "Version bump complete."
