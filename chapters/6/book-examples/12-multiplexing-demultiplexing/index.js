// Okay; now, we are ready to try our remote logging application. First, let's start the
// server:

// node server.js

// Then, we'll start the client by providing the file that we want to start as a child
// process:

// node client.js generateData.js

// The client will run almost immediately, but at the end of the process, the standard
// input and standard output of the generate-data.js application will have traveled
// through one single TCP connection and then, on the server, be demultiplexed into
// two separate files.
