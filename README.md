These instructions assume you are on Windows

## Requirements
Install these before runing the application.
- NodeJS
- Golang
- MongoDB

## Running

- Clone the repository 

```
git clone https://github.com/htho1/TimeApp.git
cd TimeApp
```

- Start MongoDB

```
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\path\to\db"
```

- Build and run the server

```
cd server
go build server.go
.\server
```

- Install dependencies and start NextJS app

```
cd ..
npm i
npm run dev
```

- Open `http://localhost:3000` (or whatever URL is displayed) in the browser