import BlynkLib
from sense_hat import SenseHat
import time
from dotenv import dotenv_values
import os
import time
from pyowm.owm import OWM

#load  configuration values from .env file
config = dotenv_values(".env")

BLYNK_AUTH = config["BLYNK_AUTH"]
# initialize Blynk
blynk = BlynkLib.Blynk(BLYNK_AUTH)

#initialise SenseHAT
sense = SenseHat()
sense.clear()

# register handler for virtual pin V1 write event
@blynk.on("V0")
def v3_write_handler(value):
    buttonValue=value[0]
    print(f'Current button value: {buttonValue}')
    if buttonValue=="1":
        sense.clear(255,255,255)
    else:
        sense.clear()


#Callibrate the temperture on the sensehat - taking into account of CPU temp
def get_cpu_temp():
  res = os.popen("vcgencmd measure_temp").readline()
  t = float(res.replace("temp=","").replace("'C\n",""))
  return(t)

#get the rain probability from the pyowm libarary
owm = OWM(config["api_id"])
mgr = owm.weather_manager()

one_call = mgr.one_call(lat=52.6542, lon=-7.2522)
one_call.forecast_hourly 
one_call.current

current_weather=one_call.current
w=one_call.forecast_hourly[0]
detailed_status= w.detailed_status
precipitation_probability= w.precipitation_probability 
outside_pressure=one_call.current.pressure["press"]
outside_temperature=one_call.current.temperature('celsius')["temp"]
outside_humidity=one_call.current.humidity

temperature=round(sense.temperature,2)
t_cpu = get_cpu_temp() # CPU temperture 
t_corr = temperature - round((t_cpu-temperature)/1.5,2) # calculates the real temperature compesating CPU heating



#tmr_start_time = time.time()
# infinite loop that waits for event
while True:
    blynk.run()
    blynk.virtual_write(1, round(t_corr,2))
    blynk.virtual_write(2, round(sense.pressure,2))
    blynk.virtual_write(3, round(sense.humidity,2))
    blynk.virtual_write(4, outside_temperature)
    blynk.virtual_write(5, outside_pressure)
    blynk.virtual_write(6, outside_humidity)
    blynk.virtual_write(7, precipitation_probability)
    if (precipitation_probability> 0):

        blynk.log_event("rain_warning")
        time.sleep(int(config["transmissionIntervalhour"]))





