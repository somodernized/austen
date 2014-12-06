import numpy as np

def regress(threshold):
  return np.vectorize(lambda x: 1 if x >= threshold else 0)

classify = regress(0.5)

def perturb(arr):
  res = np.empty_like(arr)
  per = regress(0.1)
  changes = per(np.random.uniform(0,1,arr.shape))
  flip_when = lambda pair: abs(1-pair[0]) if pair[1] else pair[0]
  return np.apply_along_axis(flip_when, 2, np.dstack((arr, changes))).flatten()

def create_population(pop_size):
  return np.random.uniform(0,1,[pop_size])

def create_interactions(pop_size):
  return (1 - np.eye(pop_size)) * np.random.uniform(0,1,[pop_size, pop_size])

def timestep(population, interactions):
  return perturb(np.dot(population, interactions)/interactions.sum(1))

class Contagion:
  
  states = ["sad", "happy"]
  people = ["Lera Bumbrey", "Orpha Penrose", "Tyron Belmont", "Dennise Tinsley", "Harlan Molina", "Jessi Tomita", "Vennie Bracken", "Sofia Gebhard", "Adam Rux", "Elden Danielson"]

  population = create_population(len(people))
  interactions = create_interactions(len(people))

  for (friends, person) in zip(classify(interactions), people):
    friends_list = ", ".join([people[idx] for (idx, known)  in enumerate(friends) if known])
    print "{} knows {}".format(person, friends_list)

  for (state, person) in zip(population, people):
    print "{} is {}".format(person, states[classify(state)])

  iters = 0
  initial_state = population
  last_state = population
  current_state = population
  all_states = [population]
  while True:
    last_state = current_state
    current_state = timestep(current_state, interactions)
    all_states.append(current_state)
    iters = iters + 1
    print "timestep {}".format(iters)

    for (idx, changed) in enumerate(classify(current_state) != classify(last_state)):
      if changed:
        print "{} changed from {} to {}".format(people[idx], states[classify(last_state[idx])], states[classify(current_state[idx])])

    if iters > 100 or np.allclose(classify(last_state), classify(current_state)):
      break

  for (final_state, initial_state, person) in zip(classify(current_state), classify(initial_state), people):
    print "{} started {} and ended {}".format(person, states[initial_state], states[final_state])

if __name__ == "__main__":
  c = Contagion
"""
  f = open("d3/contagion_results.pkl", "wb")
  pickle.dump([all_states, interactions], f)
"""