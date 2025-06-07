#!/bin/bash
cd /home/kavia/workspace/code-generation/habitflow-35758-5cf392bd/habitflow
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

