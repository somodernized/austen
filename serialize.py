import contagion
import numpy as np
import json

if __name__ == "__main__":

    C = contagion.Contagion
    
    nodes_by_step = []
    for current_state in C.all_states:
        nodes = [{"id": id, "name": person, "value": value, "state": C.states[value]} for id, (value, person) in enumerate(zip(contagion.classify(current_state), C.people))]
        nodes_by_step.append(nodes)
    
    links = []
    for source_id in range(len(C.interactions)):
        for target_id in range(len(C.interactions)):
            weight = C.interactions[source_id][target_id]
            links.append({"source": source_id, "target": target_id, "value": weight})
    
    output = {
        "nodesByStep": nodes_by_step, 
        "links": links
    }
    
    out_file = open("contagion.json", "wb")
    json.dump(output, out_file)
    out_file.close()