import numpy as np

classify = np.vectorize(lambda x: 1 if x >= 0.5 else 0)

def create_population(pop_size):
  return classify(np.random.uniform(0,1,[pop_size]))

def create_interactions(pop_size):
  return (1 - np.eye(pop_size)) * classify(np.random.uniform(0,1,[pop_size, pop_size]))

def timestep(population, interactions):
  return classify(np.dot(population, interactions)/float(population.shape[0]))

if __name__ == "__main__":
  states = ["sad", "happy"]
  people = ["Lera Bumbrey", "Orpha Penrose", "Tyron Belmont", "Dennise Tinsley", "Harlan Molina", "Jessi Tomita", "Vennie Bracken", "Sofia Gebhard", "Adam Rux", "Elden Danielson"]

  population = create_population(len(people))
  interactions = create_interactions(len(people))

  for (friends, person) in zip(interactions, people):
    friends_list = ", ".join([people[idx] for (idx, known)  in enumerate(friends) if known])
    print "{} knows {}".format(person, friends_list)

  for (state, person) in zip(population, people):
    print "{} is {}".format(person, states[state])

  iters = 0
  last_state = population
  current_state = population
  while True:
    last_state = current_state
    current_state = timestep(current_state, interactions)
    iters = iters + 1
    print "timestep {}".format(iters)

    for (idx, changed) in enumerate(current_state != last_state):
      if changed:
        print "{} changed from {} to {}".format(people[idx], states[last_state[idx]], states[current_state[idx]])

    if iters > 100 or np.allclose(last_state, current_state):
      break
