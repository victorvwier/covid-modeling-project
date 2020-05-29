# COVID-19 Epidemic Model

Currently the COVID-19 virus is affecting billions of people around the world. From our own quarantine, we, five students studying at the TU Delft in the Netherlands, have worked with the Delft Bioinformatics Lab to develop an agent-based predictive model that can estimate the situation in the Netherlands, ultimately serving as a tool that can aid in advising policy decisions and educate the public on the parameters which affect the spread of the virus.

The application is based upon the basic SIR (susceptible, infected, recovered) model, which is a simple mathematical model of an epidemic of an infectious disease in a population. We developed a model that extends upon the bases of the SIR model to emulate the behaviour of the COVID-19 virus. 

## Agent States

The agents (people) can move through the following five states:
1. Susceptible: an agent that has not been exposed to the virus
2. Non-infectious: an agent that has been infected, but is in the incubation period
3. Infectious: an infected agent that has passed the incubation period
4. Immune: an agent that was infected, but is now resistant
5. Dead: an agent that has been killed as a result of infection

This is an overview of how agents move between states within the model:

![alt tag](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2019-2020-q4/cluster-6/covid-19-modeling/covid-19-modeling/uploads/529120e88f110c31234cdf40d341c284/agent-states.png)

## The Application

In the application, you can view the agent-based model running on the right side of the screen. On the left side of the screen you can find a graph and list of statistics that are updated based on the model.

## Parameters

By opening the menu, the following model parameters can be adjusted:

* **Social distancing** how much agents avoid each other.
* **Attraction** how much agents are drawn to the center. This mimics central locations like grocery stores, etc.
* **Probability a collision will result in infection (transmission probability)**
* **Probability a non-infectious agent becomes immune**
* **Probability a non-infectious agent becomes immune:** probability a non-infectious agent never displays symptoms.
* **Minimum/Maximum incubation time:** range in which a non-infectious agent can remain in the incubation period.
* **Minimum/Maximum time a patient is infectious:** range in which an infectious agent is infectious.
* **Minimum time from end of incubation to death:** range in the amount of time before an infectious agent destined to die actually dies.
* **Circle of infection:** the amount of space around an agent in which the virus can be transmitted.
* **Initial number of susceptibles**
* **Initial number of infectious**
* **Number of communities**


## Limitiations

This application can be used to model the virus behaviour and estimate its spread. By no means is this an accurate model. It simply allows you to see the effect of multiple parameters on the spread of the virus.

## Run & Deployment information
Checkout [this guide](./app/README.md) for information on running the app and deploying it

