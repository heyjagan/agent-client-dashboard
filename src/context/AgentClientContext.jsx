
import { createContext, useState } from "react";

const AgentClientContext = createContext(null);

export function AgentClientProvider({ children }) {
  const [agents, setAgents] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignments, setAssignments] = useState([]);

  
  function addAgent(agent) {
    setAgents((previousAgents) => [
      ...previousAgents,
      {
        ...agent,
        id: crypto.randomUUID(),
      },
    ]);
  }

  
  function updateAgent(id, updatedAgent) {
    setAgents((previousAgents) =>
      previousAgents.map((agent) =>
        agent.id === id ? { ...agent, ...updatedAgent } : agent
      )
    );
  }

  
  function deleteAgent(id) {
    setAgents((previousAgents) =>
      previousAgents.filter((agent) => agent.id !== id)
    );

    setAssignments((previousAssignments) =>
      previousAssignments.filter(
        (assignment) => assignment.agentId !== id
      )
    );
  }

  
  function addClient(client) {
    setClients((previousClients) => [
      ...previousClients,
      {
        ...client,
        id: crypto.randomUUID(),
      },
    ]);
  }

  function updateClient(id, updatedClient) {
    setClients((previousClients) =>
      previousClients.map((client) =>
        client.id === id ? { ...client, ...updatedClient } : client
      )
    );
  }

  
  function deleteClient(id) {
    setClients((previousClients) =>
      previousClients.filter((client) => client.id !== id)
    );

    setAssignments((previousAssignments) =>
      previousAssignments.filter(
        (assignment) => assignment.clientId !== id
      )
    );
  }

  
  function assignClient(agentId, clientId) {
    if (!agentId || !clientId) {
      return false;
    }

    
    const agentExists = agents.some(
      (agent) => agent.id === agentId
    );

    const clientExists = clients.some(
      (client) => client.id === clientId
    );

    if (!agentExists || !clientExists) {
      return false;
    }

    
    const agentAlreadyAssigned = assignments.some(
      (assignment) => assignment.agentId === agentId
    );

    
    const clientAlreadyAssigned = assignments.some(
      (assignment) => assignment.clientId === clientId
    );

    if (agentAlreadyAssigned || clientAlreadyAssigned) {
      return false;
    }

    setAssignments((previousAssignments) => [
      ...previousAssignments,
      {
        id: crypto.randomUUID(),
        agentId,
        clientId,
      },
    ]);

    return true;
  }

  
  const value = {
    agents,
    clients,
    assignments,
    addAgent,
    updateAgent,
    deleteAgent,
    addClient,
    updateClient,
    deleteClient,
    assignClient,
  };

  return (
    <AgentClientContext.Provider value={value}>
      {children}
    </AgentClientContext.Provider>
  );
}

export default AgentClientContext;



