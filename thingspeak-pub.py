#!/usr/bin/python3

import paho.mqtt.client as mqtt
from urllib.parse import urlparse
import sys
import time
from sense_hat import SenseHat
import logging
from dotenv import dotenv_values
from pyowm.owm import OWM

import os
import time

#Callibrate the temperture on the sensehat - taking into account of CPU temp
def get_cpu_temp():
  res = os.popen("vcgencmd measure_temp").readline()
  t = float(res.replace("temp=","").replace("'C\n",""))
  return(t)

sense = SenseHat()
sense.clear()
green = (0, 255, 0)
red = (255,0,0)

#Initialise SenseHAT
sense = SenseHat()
sense.clear()

#load MQTT configuration values from .env file
config = dotenv_values(".env")

#configure Logging
logging.basicConfig(level=logging.INFO)

# Define event callbacks for MQTT
def on_connect(client, userdata, flags, rc):
    logging.info("Connection Result: " + str(rc))

def on_publish(client, obj, mid):
    logging.info("Message Sent ID: " + str(mid))

mqttc = mqtt.Client(client_id=config["clientId"])

# Assign event callbacks
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish

# parse mqtt url for connection details
url_str = sys.argv[1]
print(url_str)
url = urlparse(url_str)
base_topic = url.path[1:]

# Configure MQTT client with user name and password
mqttc.username_pw_set(config["username"], config["password"])
# Load CA certificate for Transport Layer Security
mqttc.tls_set("./broker.thingspeak.crt")

#Connect to MQTT Broker
mqttc.connect(url.hostname, url.port)
mqttc.loop_start()

#Set Thingspeak Channel to publish to
topic = "channels/"+config["channelId"]+"/publish"

#get the rain probability from the pyowm libarbary 
owm = OWM(config["api_id"])
mgr = owm.weather_manager()

# lat and lon from kilkenny
one_call = mgr.one_call(lat=52.6542, lon=-7.2522)
one_call.forecast_hourly   

w=one_call.forecast_hourly[0]
detailed_status= w.detailed_status
precipitation_probability= w.precipitation_probability


# Publish a message to temp every 15 minutes 
while True:
    try:
        temp=(sense.temperature)
        t_cpu = get_cpu_temp() # CPU temperture 
        t_corr = round(temp - ((t_cpu-temp)/1.5),2) # calculates the real temperature compesating CPU heating
        pressure=round(sense.pressure,2)
        humidity=round(sense.humidity,2)
        precipitation_probability=w.precipitation_probability
        if precipitation_probability >0:
                sense.show_message("Its raining", text_colour =red)

        payload=f"field1={t_corr}&field2={humidity}&field3={pressure}&field4={precipitation_probability}"
        mqttc.publish(topic, payload)
        time.sleep(int(config["transmissionInterval"]))
        
    except:
        logging.info('Interrupted')
        sys.exit(0)
