# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/

import json

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

def defineDict(setCamera, setMicrophone, setHuman, setCameraR, setMicrophoneR, setHumanR, setEPerson, setEVehicle, setEPlanned, setEPersonRange, setEVehicleRange, setEPlannedRange, setComplex):
    jsdict = {
        "sensorCamera": setCamera,
        "sensorMicrophone": setMicrophone,
        "sensorHuman": setHuman,
        "sensorCameraRange": setCameraR,
        "sensorMicrophoneRange": setMicrophoneR,
        "sensorHumanRange": setHumanR,
        "eventPerson": setEPerson,
        "eventVehicle": setEVehicle,
        "eventPlanned": setEPlanned,
        "personEventRange": setEPersonRange,
        "vehicleEventRange": setEVehicleRange,
        "plannedEventRange": setEPlannedRange,
        "complexEvent": setComplex

    }
    return jsdict

# **** SENSORS ****
class ActionAddSensors(Action):
    
    def name(self) -> Text:
        return "action_add_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[0] = True
        layerlst[1] = True
        layerlst[2] = True    
        layerlst[3] = True    
        layerlst[4] = True    
        layerlst[5] = True  
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveSensors(Action):
    
    def name(self) -> Text:
        return "action_remove_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[0] = False
        layerlst[1] = False
        layerlst[2] = False 
        layerlst[3] = False      
        layerlst[4] = False 
        layerlst[5] = False   
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** CAMERA SENSORS ****
class ActionAddCameraSensors(Action):
    
    def name(self) -> Text:
        return "action_add_camera_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[0] = True
        layerlst[3] = True      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveCameraSensors(Action):
    
    def name(self) -> Text:
        return "action_remove_camera_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[0] = False
        layerlst[3] = False    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** CAMERA SENSOR RANGES ****
class ActionAddCameraSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_add_camera_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[3] = True      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveCameraSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_remove_camera_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[3] = False      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** MICROPHONE SENSORS ****
class ActionAddMicrophoneSensors(Action):
    
    def name(self) -> Text:
        return "action_add_microphone_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[1] = True
        layerlst[4] = True      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveMicrophoneSensors(Action):
    
    def name(self) -> Text:
        return "action_remove_microphone_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[1] = False
        layerlst[4] = False    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** MICROPHONE SENSOR RANGES ****
class ActionAddMicrophoneSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_add_microphone_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[4] = True      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveMicrophoneSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_remove_microphone_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[4] = False      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** HUMAN SENSORS ****
class ActionAddHumanSensors(Action):
    
    def name(self) -> Text:
        return "action_add_human_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[2] = True  
        layerlst[5] = True    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveHumanSensors(Action):
    
    def name(self) -> Text:
        return "action_remove_human_sensors"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[2] = False
        layerlst[5] = False        
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** HUMAN SENSOR RANGES ****
class ActionAddHumanSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_add_human_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")   
        layerlst[5] = True    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveHumanSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_remove_human_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[5] = False        
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** SENSOR RANGES ****
class ActionAddSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_add_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[3] = True    
        layerlst[4] = True   
        layerlst[5] = True    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveSensorRanges(Action):
    
    def name(self) -> Text:
        return "action_remove_sensor_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[3] = False 
        layerlst[4] = False        
        layerlst[5] = False 
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]
    
# **** EVENTS ****
class ActionAddEvents(Action):
    
    def name(self) -> Text:
        return "action_add_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[6] = True
        layerlst[7] = True
        layerlst[8] = True   
        layerlst[9] = True
        layerlst[10] = True
        layerlst[11] = True     
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveEvents(Action):
    
    def name(self) -> Text:
        return "action_remove_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[6] = False
        layerlst[7] = False
        layerlst[8] = False   
        layerlst[9] = False
        layerlst[10] = False     
        layerlst[11] = False
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** PERSON EVENTS ****
class ActionAddPersonEvents(Action):
    
    def name(self) -> Text:
        return "action_add_person_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[6] = True   
        layerlst[9] = True  
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemovePersonEvents(Action):
    
    def name(self) -> Text:
        return "action_remove_person_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[6] = False     
        layerlst[9] = False
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** VEHICLE EVENTS ****
class ActionAddVehicleEvents(Action):
    
    def name(self) -> Text:
        return "action_add_vehicle_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[7] = True   
        layerlst[10] = True
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveVehicleEvents(Action):
    
    def name(self) -> Text:
        return "action_remove_vehicle_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[7] = False  
        layerlst[10] = False    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** PLANNED EVENTS ****
class ActionAddPlannedEvents(Action):
    
    def name(self) -> Text:
        return "action_add_planned_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[8] = True    
        layerlst[11] = True    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemovePlannedEvents(Action):
    
    def name(self) -> Text:
        return "action_remove_planned_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[8] = False 
        layerlst[11] = False       
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** EVENT RANGES ****
class ActionAddEventRanges(Action):
    
    def name(self) -> Text:
        return "action_add_event_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[9] = True 
        layerlst[10] = True
        layerlst[11] = True    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveEventRanges(Action):
    
    def name(self) -> Text:
        return "action_remove_event_ranges"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[9] = False  
        layerlst[10] = False
        layerlst[11] = False    
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

# **** COMPLEX EVENTS ****
class ActionAddComplexEvents(Action):
    
    def name(self) -> Text:
        return "action_add_complex_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[12] = True     
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]

class ActionRemoveComplexEvents(Action):
    
    def name(self) -> Text:
        return "action_remove_complex_events"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Changing map view...")

        layerlst = tracker.get_slot("layers")
        layerlst[12] = False      
        
        jsdict = defineDict(layerlst[0], layerlst[1], layerlst[2], layerlst[3], layerlst[4], layerlst[5], layerlst[6], layerlst[7], layerlst[8], layerlst[9], layerlst[10], layerlst[11], layerlst[12])
        jsontxt = "JSON;" + json.dumps(jsdict)
        dispatcher.utter_message(text=jsontxt)

        return [SlotSet("layers", layerlst)]