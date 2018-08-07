#!/bin/sh
#//--------------------------------------------------------------------------//
#// Check for the NOHUP                                                      //
#//--------------------------------------------------------------------------//
if [ "$1" != "" ] ; then
   PD_NOHUP=YES
fi

#//--------------------------------------------------------------------------//
#// Start the Application.                                                   //
#//--------------------------------------------------------------------------//
#clear
if [ ${PD_NOHUP}. == YES. ]; then
	nohup node server.js --port 80 > $0.out &
else
	node server.js --port 80
fi

#//--------------------------------------------------------------------------//
#// Reset nohup command                                                      //
#//--------------------------------------------------------------------------//

PD_NOHUP=NO                                                                      export PD_NOHUP