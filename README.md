# node-txr (transfer)

Send files from one computer/server to another easier than you ever have before. As long as both have an internet connection, you can send files to each other.

## Example

### Computer 1

```sh
$ txr listen computer1
# Successfully registered name: computer1. You are now listening for files.
# Starting to receive file with data: {"filename":"file.json","filesizebytes":2048}
# .........
# Finished receiving file with data: {"filename":"file.json","filesizebytes":2048}
# Target file path: /Users/username/file_1593026398451.json
```

### Computer 2

```sh
$ txr send computer1 -f ./a/config/file.json
# .........
# All bytes have been read from file: ./a/config/file.json.
# Your file has successfully sent to computer1!
```

## Install

```bash
# for CLI use
$ npm install -g txr

# for library use
$ npm install txr
```

## What is this, and why?

This package hopefully makes it stupid easy to send files to other computers without needing to connect to them via ssh, scp, ftp, or any other protocol that requires some sysadmin and networking skills to setup. This package includes both a client and server component. The server listens for connections from clients and handles sending files to and from each other. Clients can listen for files, send files, and even chat with others all with a single identifier (what we call a "username").

We have a default server listening for connections on Heroku at `https://txr.euphoritech.com`, which is what any new client will connect to by default. Files are **never** stored anywhere on the server since it's basically just serving as a middleman between clients, but feel free to audit the code to confirm. I also encourage you to [setup your own server](#server) to use offline or in your own secure network if you're passing sensitive data to others and/or have more stringent security requirements.

![Easily setup a server and 2 clients!](https://user-images.githubusercontent.com/13718950/32149608-89e29732-bcdd-11e7-96cf-ee9fbb1aeca8.gif)

## node-txr's goal

Ease-of-use and simplicity, period. I'm aware there are already industry standard and well audited tools built for security (ssh, sftp, scp, etc.) to accomplish the same end goal this package serves, but all require a level of sysadmin and networking skills to setup and get running. If I setup a small EC2 machine and want to send a directory of 100 images to it that is on my computer for example, or want to send a coworker and small config file quickly and easily, this package hopefully removes the hoops you would usually have to jump through to get them there.

## Quick Start (cli)

### Setup listening client

```bash
$ # Connect to the default server (https://txr.euphoritech.com) to listen for files sent to your username
$ txr listen -u myname123
Successfully registered name: myname123. You are now listening for files.
```

### Send a file to your listening client

```bash
$ # Connect to the default server (https://txr.euphoritech.com) to send the specified file to your listening client
$ txr send -u myname123 -f /path/to/file/to/send
........
All bytes have been read from file: /path/to/file/to/send.
Your file has successfully sent to myname123!
```

## How does txr work?

**Server**: the server listens for clients to connect and manages registering
"listener" clients based on a provided username.

**Client**: There are three types of clients:

1. **listener**, who registers a desired username with the server and waits
   for anyone who wants to send files to him/her.
2. **sender**, who can send files or directories from his/her local machine
   to a listener based on the listener's username they registered with.
3. **chat** user, who will register a username with the txr server and
   designate another listening/chatting user who they would like to send chat messages to.

## Server

As of today, there is a Heroku hobby dyno that has a server waiting for
client connections (https://txr.euphoritech.com). If you install this
package you can start a listening client with that server without doing
anything else other than running the client "listener" command below.
If you want to run a txr-server separately than the Heroku dyno,
follow instructions below and be sure the point the TXR_HOST environment
variable (or -h/--host parameter) of your clients to the appropriate endpoint.

### Config

The following are environment variables you can configure to
customize your server:

1. LOGGING_LEVEL: The [bunyan](https://github.com/trentm/node-bunyan) logging level. DEFAULT: 'info'
2. PORT: The port your server will listen on. DEFAULT: 8000
3. REDIS_URL: Only applicable if you are using the 'redis' type parameter below, but will
   determine the server/db combo with which connected client data will be stored.
   DEFAULT: redis://localhost:6379

### Parameters

1. Optional: -t/--type: If present, will determine where information about the connected
   clients will live. DEFAULT: 'memory' - memory: Connected client information will be stored in memory in a Javascript object - redis: Connected client information will be stored in a redis database, where the
   connection string for the redis server should be in process.env.REDIS_URL (default: 'redis://localhost:6379')
2. Optional: -p/--port: If present, this will override the PORT config
   that determines what port for the server to listen on.

### Start server

```bash
$ txr-server
$ txr-server -p 3000
```

## Clients

### Config

The following are environment variables you can configure to
customize your clients:

1. TXR_HOST: The full URL (including protocol and port) of the txr-server
   you are connecting to. DEFAULT: https://txr.euphoritech.com
2. TXR_PATH: For "listener" clients, this is the path to a directory
   where files you receive will be delivered to.
   DEFAULT: process.env.HOME - unix/linux, process.env.USERPROFILE - windows

### Client types

#### "listener": listen for files to be sent to you

##### Parameters:

1. Required: -u/--user: The username you want to register with the server as.
2. Optional: -a/--auth: If present, you will need to authorize any files
   attempted to be sent to you before they'll be sent.
3. Optional: -h/--host: If present, this will override the TXR_HOST config
   that points to the server you'll connect to.

```bash
$ txr listen yourUniqueUsername
$ txr listen -u yourUniqueUsername
$ txr listen -u yourUniqueUsername -a
$ txr listen -u yourUniqueUsername -h http://localhost:8000
$ txr listen -u yourUniqueUsername -h ws://localhost:8000
```

#### "sender": send a file to someone listening for files to be sent to them

##### Parameters

1. Required: -f/--file or -d/--dir: The full path of the file or directory you're sending to a "listener"
2. Required: -u/--user: The "listener" client's username you're sending a file to.
3. Optional: -h/--host: If present, this will override the TXR_HOST config
   that points to the server you'll connect to.

```bash
$ txr send yourFriendsUniqueUsername -f /local/path/to/file/or/dir
$ txr send -u yourFriendsUniqueUsername -f /local/path/to/file/or/dir
$ txr send -u yourFriendsUniqueUsername -d /local/path/to/file/or/dir
$ txr send -u yourFriendsUniqueUsername -f /local/path/to/file/or/dir -h http://localhost:8000
$ txr send -u yourFriendsUniqueUsername -f /local/path/to/file/or/dir -h ws://localhost:8000
```

#### "chat": send chat messages to someone listening with a particular username. The target user can be a "listening" or "chatting" client.

Note: As of today a chat client can only be created if the listener and chatter
are using the CLI interface.

##### Parameters

1. Required: -u/--user: Your username you're registering as.
2. Required: -t/--target_user: The username of the user listening for files that you're going to chat with
3. Optional: -h/--host: If present, this will override the TXR_HOST config
   that points to the server you'll connect to.

```bash
$ txr chat -u myUsername -t myFriendsUsername
```

## Development

### Build /dist files

```bash
$ npm run build
```

## TODO

- Dockerfile for server
- Extend Test Coverage
- Improve documentation
- Additional interfaces?
