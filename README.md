# txr

## Transfer Files Hilariously Easily using Web Sockets

This tool provides a ridiculously quick and simple way to send files
from your machine to whomever you want (team members, family, etc.)
as long as both of you have an internet connection. It contains both a server
and client component, both of which communicate with each other through
web sockets (using socket.io and socket.io-client to be exact.)

## High Level Description

**Server**: the server listens for clients to connect and manages registering
client connections based on a specified "username" provided by a client
who wishes to listen for files being sent to him/her.

**Client**: There are two types of clients.

1. A "listener", who registers a desired username with the server and waits
for anyone who may be wanting to send files to him/her.
2. A "sender", who can send files from his/her local machine to a "listener"
based on the listener's username they registered with.

## Install & Setup

```
npm install -g txr
```

## Server

```
txr-server
```

## Client

### Send a file to someone listening for files to be sent to them

```
txr send -u yourFriendsUniqueUsername -f /local/path/to/your/file/to/send
```

### Listen for files

```
txr listen -u yourUniqueUsername
```
