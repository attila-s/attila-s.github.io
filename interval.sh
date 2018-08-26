#!/bin/bash

NSETS=$1
WORK_INTERVAL=$2
REST_INTERVAL=$3

#TODO check if all ogg files exist
alert_start() {
    ogg123 -q /usr/share/sounds/ubuntu/stereo/phone-outgoing-calling.ogg &
}

alert_end() {
  ogg123 -q /usr/share/sounds/ubuntu/stereo/phone-outgoing-calling.ogg &
}

alert_tick() {
  ogg123 -q /usr/share/sounds/ubuntu/stereo/dialog-error.ogg
  sleep 0.1 # approx time
}

count_down() {
  MSG=$1
  LIMIT=$2
  for j in $(seq 0 $(($LIMIT-1))); do
    clear
    ACT=$(($LIMIT - j))
    if [ $ACT -lt 10 ]; then
      ACT="0$ACT"
    fi

    banner "$MSG" "  $ACT"
    if [ $(($LIMIT - j)) -lt 4 ]; then      
      alert_tick
    else
      sleep 1
    fi
  done
}

startup() {
  clear 
  banner "Get ready!"
}

#TODO print out trainig type
work_hard() {
  alert_start
  count_down "WORK $1" $WORK_INTERVAL
  alert_end
}

rest() {
  count_down "REST $i" $REST_INTERVAL
}

bye() {
  clear
  alert_end&
  banner "Well done"
}

startup

for i in $(seq 1 $NSETS); do
  work_hard $i
  if [[ $i -ne $NSETS ]]; then
    rest $i
  fi 
done

bye
