# Poorman's interval timer

This is a minimalistic interval timer for persons who don't like to click.

## Example

Here is a 6 mins workout: 

``./interval.sh 12 15 15``

You can do for example
*   Squat    Lap 1 5 9
*   Snatch   Lap 2 6 10
*   Snatch   Lap 3 7 11
*   Plank    Lap 4 5 12

( workout is kindly stolen from https://breakingmuscle.com/learn/short-and-sweet-4-new-6-minute-workouts-for-busy-people )


	#     # ####### ######  #    #           #####
	#  #  # #     # #     # #   #           #     #
	#  #  # #     # #     # #  #                  #
	#  #  # #     # ######  ###              #####
	#  #  # #     # #   #   #  #                  #
	#  #  # #     # #    #  #   #           #     #
	 ## ##  ####### #     # #    #           #####

	                  ###   #
	                 #   #  #    #
	                # #   # #    #
	                #  #  # #######
	                #   # #      #
	                 #   #       #
	                  ##                           

## Prerequisites

I tested the stuff on Ubuntu 16.04 LTS with the following packages installed: 

* banner
* ogg123

## Future

TODO 
* suppot other time units minutes
* better parsing
* add workout description
* support stop/resume
* make it dynamically configurable somehow (JSON / YAML / etc)
* rewrite the whole stuff; preferably in python
* tests
* add voice control :D
* create client-server stuff where server can store workouts (CURD) and feed its clients with workouts
* log stuff who accessed it when, etc.
* security (adduthn/authz/over-the-wire encryption)
* server makes recommendations :D
* add web UI 
* server HA mode
* make profit and take over the world
* skynet


