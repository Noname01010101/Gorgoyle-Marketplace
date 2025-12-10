<#
  Simple PowerShell markdown checks to help detect common issues.
  Run from repository root:

  powershell -ExecutionPolicy Bypass -File .\docs\check-markdown.ps1

#>

Write-Host "Running basic markdown checks..."

$mdFiles = Get-ChildItem -Path . -Include *.md -Recurse | Where-Object { -not ($_.FullName -match '\.git') -and -not ($_.FullName -match '\\node_modules\\') }

$failures = @()

foreach ($f in $mdFiles) {
  $text = Get-Content $f.FullName -Raw

  # Check frontmatter presence: first non-empty line must be '---'
  $firstNonEmpty = ($text -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' } | Select-Object -First 1)
  if ($null -eq $firstNonEmpty -or $firstNonEmpty -ne '---') {
    $failures += "Missing frontmatter: $($f.FullName)"
  }

  # Check for very long lines (> 200 chars)
  $lines = $text -split "`n"
  for ($i=0; $i -lt $lines.Length; $i++) {
    if ($lines[$i].Length -gt 200) {
      $failures += "Long line ($($lines[$i].Length)) $($f.FullName):$($i+1)"
    }
  }
}

if ($failures.Count -eq 0) {
  Write-Host "No issues found by basic checks." -ForegroundColor Green
  exit 0
} else {
  Write-Host "Issues found:" -ForegroundColor Yellow
  $failures | ForEach-Object { Write-Host $_ }
  exit 1
}
