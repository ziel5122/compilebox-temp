#!/bin/bash

awk -f $1 /usercode/malloc-out.txt > file.out

diff -iw file.out /usercode/num_bytes.sol 