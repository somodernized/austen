import contagion as ct
import pickle

f = open("d3/contagion_results.pkl", "wb")
pickle.dump([ct.all_states, ct.interactions], f)