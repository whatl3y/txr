# txr

## Transfer Files/Directories to others hilariously easily streaming through Web Sockets

txr is a CLI utility that provides a quick and simple way to send files or directories
from one machine to another (i.e. to team members, remote machines, servers, family, etc.)
as long as both machines can connect to a txr-server (either locally or on the internet)
and have a txr client installed and running. This package contains a
server and two client components. The server and clients communicate with each other
through web sockets to stream files or directories back and forth between clients. Files are
**never** stored anywhere on the server, as it simply acts as a proxy between
listening and sending clients.

- If sending a file, it's streamed to the listening client through fs.createReadStream
- If sending a directory, the entire directory is zipped up on the sender's machine,
then the output zipped file is streamed to the listening client

![Easily setup a server and 2 clients!](https://user-images.githubusercontent.com/13718950/32149608-89e29732-bcdd-11e7-96cf-ee9fbb1aeca8.gif)

## How does txr ("transfer") work?

**Server**: the server listens for clients to connect and manages registering
"listener" clients based on a provided username.

**Client**: There are two types of clients:

1. A "listener", who registers a desired username with the server and waits
for anyone who wants to send files to him/her.
2. A "sender", who can send files/directories from his/her local machine to a listener
based on the listener's username they registered with.

## Install & Setup

```
npm install -g txr
```

## Server

As of today, there is a Heroku hobby dyno that has a server waiting for
client connections. If you install this package you can start a listening client
with that server without doing anything else other than running the
client "listener" command below. If you want to run a txr-server separately
than the Heroku dyno, follow instructions below and be sure the
point the TXR_HOST environment variable (or -h/--host parameter) of your clients
to the appropriate endpoint.

### Config

The following are environment variables you can configure to
customize your server:

1. LOGGING_LEVEL: The [bunyan](https://github.com/trentm/node-bunyan) logging level. DEFAULT: 'info'
2. PORT: The port your server will listen on. DEFAULT: 8000

### Parameters

1. Optional: -p/--port: If present, this will override the PORT config
that determines what port for the server to listen on.

### Start server

```
txr-server
txr-server -p 3000
```

## Clients

### Config

The following are environment variables you can configure to
customize your clients:

1. TXR_HOST: The full URL (including protocol and port) of the txr-server
you are connecting to. DEFAULT: wss://txr.herokuapp.com
2. TXR_PATH: For "listener" clients, this is the path to a directory
where files you receive will be delivered to.
DEFAULT: $HOME-unix/linux, $USERPROFILE-windows

### Client types

#### "listener": listen for files to be sent to you

##### Parameters:

1. Required: -u/--user: The username you want to register with the server as.
2. Optional: -a/--auth: If present, you will need to authorize any files
attempted to be sent to you before they'll be sent.
3. Optional: -h/--host: If present, this will override the TXR_HOST config
that points to the server you'll connect to.

```
txr listen -u yourUniqueUsername
txr listen -u yourUniqueUsername -a
txr listen -u yourUniqueUsername -h http://localhost:8000
```

#### "sender": send a file to someone listening for files to be sent to them

##### Parameters

1. Required: -f/--file or -d/--dir: The full path of the file or directory you're sending to a "listener"
2. Required: -u/--user: The "listener" client's username you're sending a file to.
3. Optional: -h/--host: If present, this will override the TXR_HOST config
that points to the server you'll connect to.

```
txr send -u yourFriendsUniqueUsername -f /local/path/to/file/or/dir
txr send -u yourFriendsUniqueUsername -d /local/path/to/file/or/dir
txr send -u yourFriendsUniqueUsername -f /local/path/to/file/or/dir -h http://localhost:8000
```

## Development

### Build dist files

```
gulp build
```
