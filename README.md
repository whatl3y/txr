# txr

## Transfer Files Hilariously Easily to others through Web Sockets

This tool provides a quick and simple way to send files from your
machine to another (to team members, family, remote machines, etc.)
as long as both of you have an internet connection and txr installed and running.
It contains both a server and client component, both of which communicate
with each other through web sockets.

## How does txr ("transfer") work?

**Server**: the server listens for clients to connect and manages registering
client connections based on a specified "username" provided by a "listener"
client.

**Client**: There are two types of clients:

1. A "listener", who registers a desired username with the server and waits
for anyone who wants to send files to him/her.
2. A "sender", who can send files from his/her local machine to a "listener"
based on the listener's username they registered with.

## Install & Setup

```
npm install -g txr
```

## Server

As of today, there is a Heroku hobby dyno that has a server waiting for
client connections. If you install this package globally you can start
a listening client without doing anything else other than running the
client "listener" command below. If you want to run a txr-server separately
than the heroku dyno, follow instructions below and be sure the
point the TXR_HOST environment variable in your clients to the appropriate
endpoint.

### Config

The following are environment variables you can configure to
customize your server:

1. LOGGING_LEVEL: The [bunyan](https://github.com/trentm/node-bunyan) logging level. DEFAULT: 'info'
2. PORT: The port your server will listen on. DEFAULT: 8000

### Start server

```
txr-server
```

## Clients

### Config

The following are environment variables you can configure to
customize your clients:

1. TXR_HOST: The full URL (including protocol and port) of the txr-server
you are connecting to. DEFAULT: http://txr.herokuapp.com
2. TXR_PATH: For "listener" clients, this is the path to a directory
where files you receive will be delivered to.
DEFAULT: $HOME-unix/linux, $USERPROFILE-windows

### Client types

#### "listener": listen for files to be sent to you

##### Parameters:

1. Required: -u/--user: The username you want to register with the server as.
2. Optional: -a/--auth: If present, you will need to authorize any files
attempted to be sent to you.

```
txr listen -u yourUniqueUsername
txr listen -u yourUniqueUsername -a
```

#### "sender": send a file to someone listening for files to be sent to them

##### Parameters

1. Required: -f/--file: The local filepath to the file you're sending to a "listener"
2. Required: -u/--user: The "listener" client's username you're sending a file to.

```
txr send -u yourFriendsUniqueUsername -f /local/path/to/file
```
