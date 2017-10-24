# txr

## Transfer Files Hilariously Easily to others using Web Sockets

This tool provides a quick and simple way to send files from your
machine to whomever you want (team members, family, etc.)
as long as both of you have an internet connection. It contains both a server
and client component, both of which communicate with each other through
web sockets.

## High Level Description

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

### Client types

#### "listener": listen for files to be sent to you

```
txr listen -u yourUniqueUsername
```

#### "sender": send a file to someone listening for files to be sent to them

```
txr send -u yourFriendsUniqueUsername -f /local/file/path/to/file
```
