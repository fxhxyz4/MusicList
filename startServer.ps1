Install-Module -Name EnvFile
Load-EnvFile -Path .env

Start-Process -FilePath Chrome -ArgumentList "localhost:$env:PORT"
node index
